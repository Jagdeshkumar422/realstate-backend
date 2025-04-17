const asyncHandler = require("express-async-handler");
const Rent = require("../models/rentModel");
const cloudinary = require("cloudinary");
const { processAndUploadImage } = require("../Utils/uploadImage");

//Cloudinary connection
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// @desc Get all rent properties
// @route GET /api/rent
// @access Public
// @desc Get all buy properties
// @route GET /api/buy
// @access Public
const getAllRent = asyncHandler(async (req, res) => {
  try {
    let query = req.query.filter || {}; // Ensure query.filter is always an object

    if (typeof query === "string") {
      try {
        query = JSON.parse(query); // Convert string to object if needed
      } catch (error) {
        return res.status(400).json({ status: "error", message: "Invalid query format" });
      }
    }

    let bedroomFilter;
    if (query.bedrooms) {
      if (typeof query.bedrooms === "string") {
        bedroomFilter = query.bedrooms === "7" ? { $gte: 7 } : { $eq: parseInt(query.bedrooms) };
      } else if (Array.isArray(query.bedrooms)) {
        bedroomFilter = query.bedrooms.includes("7") ? { $gte: 7 } : { $in: query.bedrooms.map(Number) };
      } else {
        bedroomFilter = { $lte: 999999 };
      }
    }

    let filter = {
      property_type: query.property_type && query.property_type !== "all" ? query.property_type : "",
      minPrice: query.minPrice ? parseInt(query.minPrice) : 0,
      maxPrice: query.maxPrice ? parseInt(query.maxPrice) : 999999999999,
      minSize: query.minSize ? parseInt(query.minSize) : 0,
      maxSize: query.maxSize ? parseInt(query.maxSize) : 999999999999,
    };

    let conditions = [
      { price: { $gte: filter.minPrice, $lte: filter.maxPrice } },
      { size: { $gte: filter.minSize, $lte: filter.maxSize } },
      { rented_by: { $eq: '' } },
    ];

    if (filter.property_type) {
      conditions.push({ appartement_type: filter.property_type });
    }

    if (bedroomFilter) {
      conditions.push({ bedrooms: bedroomFilter });
    }

    if (query.furnished === "true") {
      conditions.push({ furnished: true });
    }

    const property = await Rent.find({ $and: conditions }).sort({ createdAt: -1 });

    res.status(200).json(property);
  } catch (error) {
    console.error("Error fetching rental properties:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});



// @desc Get all rent properties
// @route GET /api/rent/search
// @access Public
const getAllRentWithFilter = asyncHandler(async (req, res) => {
  let searchQuery=req.query.search.search
  try {
    const property = await Rent.find({ name: { $regex: searchQuery, $options: "i"  } }).sort({
        createdAt: -1,
      })
    res.status(200).send(property);
  } catch (error) {
    res.status(500).send(error);
  }
});
// @desc Get a rent property by TD
// @route GET /api/rent/:id
// @access Public
const getRentById = asyncHandler(async (req, res) => {
  try {
    const property = await Rent.findById(req.params.id);
    if (!property) {
      return res.status(404).send();
    }
    res.send(property);
  } catch (error) {
    res.status(500).send(error);
  }
});

// @desc Create the rent property
// @route POST /api/rent
// @access Private
const createRent = asyncHandler(async (req, res) => {
  try {
    let images = [];
    const name = req.body.name;
    const nameExists = await Rent.findOne({ name });
    if (nameExists) {
      res.status(409).send("Property already exists");
    }else{
      if(req.files){
        for(const image of req?.files?.image){
          let uploadedimage=await processAndUploadImage(image?.path)
          images.push(uploadedimage)
        }
      }
  
    const property = new Rent({
      user: req.body.user,
      name: name,
      appartement_type: req.body.appartement_type,
      category: req.body.category,
      image: images,
      location: req.body.location,
      floor: req.body.floor,
      size: req.body.size,
      bedrooms: req.body.bedrooms,
      WhatsAppNumber: req.body.WhatsAppNumber,
      bathrooms: req.body.bathrooms,
      parkings: req.body.parkings,
      unit_type: req.body.unit_type,
      payment_plan: req.body.payment_plan,
      hand_over_date: req.body.hand_over_date,
      neighborhood: req.body.neighborhood,
      additional_features: req.body.additional_features,
      furnished: req.body.furnished,
      description: req.body.description,
      price: req.body.price,
      address:req.body.address
    });

    await property.save();
    res.status(201).send(property);
  }
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});
// @desc Update the rent property
// @route PUT /api/rent/:id
// @access Private
const updateRentById = asyncHandler(async (req, res) => {
  try {
    const property = await Rent.findById(req.params.id);
    let images=[]
    if (!property) {
      res.status(400);
      throw new Error("property not found");
    }else{
      
    images=property.image
    if(req.files){
      for(const image of req?.files?.image){
        let uploadedimage=await processAndUploadImage(image?.path)
        images.push(uploadedimage)
      }
    }req.body.image=images

    await Rent.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json( "property updated successfully");
  }
    
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
 
});
// @desc Delete the rent property
// @route DELETE /api/rent/:id
// @access Private
const deleteRentById = asyncHandler(async (req, res) => {
  try {
    const property = await Rent.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).send("Not found");
    }
    res.send(property);
  } catch (error) {
    res.status(500).send(error);
  }
});

const removeImage = asyncHandler(async (req, res) => {
  let { propertyId, imageId } = req.params;
  let property = await Rent.findById(propertyId);
  if (property) {
    let [filteredImage] = property.image.filter(
      (image) => image.public_id === imageId
    );
    //check repuested image exists
    if (filteredImage?.public_id) {
      let deleted = await cloudinary.uploader.destroy(filteredImage.public_id);
      //check if image got deleted from couldinary
      if (deleted.result === "ok") {
        //find the index of the deleted image in our images array
        let index = property.image.findIndex(
          (image) => image.public_id === imageId
        );
        //remove the deleted image from the array of images
        property.image.splice(index, 1);
        await property.save();
        res.status(201).send("image removed successfully");
      } else {
        res.status(400).send("something went wrong");
      }
    } else {
      res.status(404).send("image not found");
    }
  } else {
    res.status(404).send("image not found");
  }
});
module.exports = {
  getAllRent,
  getRentById,
  createRent,
  updateRentById,
  deleteRentById,
  removeImage,
  getAllRentWithFilter
};
