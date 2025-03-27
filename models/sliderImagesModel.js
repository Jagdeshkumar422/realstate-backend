const mongoose = require("mongoose");

const sliderImagesSchema = mongoose.Schema(
  {
    image: { url: { type: String }, public_id: { type: String } }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SliderImages", sliderImagesSchema);
