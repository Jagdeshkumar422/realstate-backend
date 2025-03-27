const asyncHandler = require("express-async-handler");
const SliderImages = require("../models/sliderImagesModel");
const { processAndUploadImage } = require("../Utils/uploadImage");
const cloudinary = require("cloudinary");

const addSliderImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please upload an image");
    }

    const result = await processAndUploadImage(req.file.path);
    
    const sliderImage = await SliderImages.create({
      image: { url: result.url, public_id: result.public_id },
    });

    if (sliderImage) {
      res.status(201).json(sliderImage);
    } else {
      res.status(400);
      throw new Error("Invalid slider image data");
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "An error occurred while adding the slider image",
    });
  }
});

const deleteSliderImage = asyncHandler(async (req, res) => {
  try {
    const sliderImage = await SliderImages.findById(req.params.id);

    if (sliderImage) {
        let image = sliderImage?.image;
        console.log(image.public_id);
        if (image?.public_id) {
          let deleted = await cloudinary.uploader.destroy(image.public_id);
          console.log("deleted", deleted);
          if (deleted.result === "ok") {
            await SliderImages.findByIdAndDelete(req.params.id);
            res.status(200).send("image removed successfully");
          } else {
            res.status(400).send("something went wrong");
          }
        } else {
          res.status(404).send("image not found");
        }
    } else {
        res.status(404).send("Slider image not found");
    }

  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "An error occurred while deleting the slider image",
    });
  }
});

const getAllSliderImages = asyncHandler(async (req, res) => {
  try {
    const sliderImages = await SliderImages.find({}).sort({ createdAt: -1 });
    
    res.status(200).json(sliderImages);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching slider images",
    });
  }
});

module.exports = {
  addSliderImage,
  deleteSliderImage,
  getAllSliderImages,
};



