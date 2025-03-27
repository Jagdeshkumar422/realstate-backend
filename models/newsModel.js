const mongoose = require("mongoose");

const NewsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      default:""
    },
    description: {
      type: String,
      default:""
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("News", NewsSchema);
