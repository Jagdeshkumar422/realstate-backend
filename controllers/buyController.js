const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary");
const Buy = require("../models/buyModel");
const { processAndUploadImage } = require("../Utils/uploadImage");

//Cloudinary connection
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// @desc Get all buy properties
// @route GET /api/buy
// @access Public
const getAllBuy = asyncHandler(async (req, res) => {
  try {
    let query = req.query.filter;
    let bedroomFilter;
    if (typeof query.bedrooms === "string") {
      bedroomFilter = { $lte: 999999 };
    }else if (typeof query.bedrooms === "object"&&query.bedrooms.length===1){
      bedroomFilter={$in:[0]}
    }
     else if (typeof query.bedrooms === "object") {
      if (query.bedrooms.includes("7")) {
        bedroomFilter = { $lte: 999999 };
      } else {
        bedroomFilter = { $in: query.bedrooms };
      }
    }
    let filter = {
      property_type: query.property_type === "all" ? "" : query.property_type,
      minPrice: query.minPrice === "" ? 0 : parseInt(query.minPrice),
      maxPrice: query.maxPrice === "" ? 999999999999 : parseInt(query.maxPrice),
      minSize: query.minSize === "" ? 0 : query.minSize,
      maxSize: query.maxSize === "" ? 999999999999 : query.maxSize,
    };
    let conditions = [
      { price: { $lte: filter.maxPrice, $gte: filter.minPrice } },
      { size: { $lte: filter.maxSize, $gte: filter.minSize } },
      { appartement_type: { $regex: filter.property_type } },
      { bedrooms: bedroomFilter },
      { sold_to: { $eq: '' } } 
    ];
    if(query.furnished==='true'){
      conditions.push({furnished:true})
    }

    const property = await Buy.find({ $and: conditions }).sort({ createdAt: -1 });
    res.send(property);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// @desc Get all buy properties
// @route GET /api/buy/search
// @access Public
const getAllBuyWithFilter = asyncHandler(async (req, res) => {
  try {
    let searchQuery = req.query.search.search;
    const property = await Buy.find({
      name: { $regex: searchQuery, $options: "i" },
    }).sort({
      createdAt: -1,
    });
    res.status(200).send(property);
  } catch (error) {
    res.status(500).send(error);
  }
});

// @desc Get a buy property by TD
// @route GET /api/buy/:id
// @access Public
const getBuyById = asyncHandler(async (req, res) => {
  try {
    const property = await Buy.findById(req.params.id);
    if (!property) {
      return res.status(404).send();
    }
    res.send(property);
  } catch (error) {
    res.status(500).send(error);
  }
});

// @desc Create the buy property
// @route POST /api/buy
// @access Private
const createBuy = asyncHandler(async (req, res) => {
  try {
    let images = [];

    const name = req.body.name;
    const nameExists = await Buy.findOne({ name });
    if (nameExists) {
      res.status(409).send("Property already exists");
    } else {
      if (req.files) {
        for (const image of req?.files?.image) {
          let uploadedImage = await processAndUploadImage(image?.path);
          images.push(uploadedImage);
        }
      }

      const property = new Buy({
        user: req.body.user, // Add the user ID from request
        name: name,
        appartement_type: req.body.appartement_type,
        category: req.body.category,
        image: images,
        location: req.body.location,
        floor: req.body.floor,
        size: req.body.size,
        unit_type: req.body.unit_type,
        payment_plan: req.body.payment_plan,
        hand_over_date: req.body.hand_over_date,
        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms,
        parkings: req.body.parkings,
        additional_features: req.body.additional_features,
        furnished: req.body.furnished,
        description: req.body.description,
        neighborhood: req.body.neighborhood,
        availability: req.body.availability,
        price: req.body.price,
        address: req.body.address,
        whatsapp_number: req.body.whatsapp_number
      });

      await property.save();
      res.status(201).send(property);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});


// @desc Update the buy property
// @route PUT /api/buy/:id
// @access Private
const updateBuyById = asyncHandler(async (req, res) => {
  try {
    const property = await Buy.findById(req.params.id);
    let images = [];

    if (!property) {
      res.status(400);
      throw new Error("property not found");
    } else {
      images = property.image;
      if (req.files) {
        for (const image of req?.files?.image) {
          let uploadedimage = await processAndUploadImage(image?.path);
          images.push(uploadedimage);
        }
      }
      req.body.image = images;

      await Buy.findByIdAndUpdate(req.params.id, req.body);

      res.status(200).json("property updated successfully");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
// @desc Delete the buy property
// @route DELETE /api/buy/:id
// @access Private
const deleteBuyById = asyncHandler(async (req, res) => {
  try {
    const property = await Buy.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).send("Not found");
    }
    res.status(200).send(property);
  } catch (error) {
    res.status(500).send(error);
  }
});

const removeImage = asyncHandler(async (req, res) => {
  let { propertyId, imageId } = req.params;
  let property = await Buy.findById(propertyId);
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
  removeImage,
  getAllBuy,
  getBuyById,
  createBuy,
  updateBuyById,
  deleteBuyById,
  getAllBuyWithFilter,
};
