const mongoose = require("mongoose");

const rentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Store the User ID
      ref: "User", // Reference the User model
      required: [true, "User ID is required"], // Ensure a user ID is always stored
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    property_type: {
      type: String,
      default: "Rent", 
    },
    appartement_type: {
      type: String,
      required: [true, "Please add an appartment type"],
    },
    category: {
      type: String,
      required: [true, "Please add a password"],
    },
    image: [{ url: { type: String }, public_id: { type: String } }],
    location: {
      type: String,
      default: "", 
    },
    floor: {
      type: String,
      default: "", 
    },
    unit_type: {
      type: String,
      default: "",
    },
    payment_plan: {
      type: String,
      default: "",
    },
    neighborhood: {
      type: String,
      default: "",
    },
    hand_over_date: {
      type: String,
      default: "",
    },
    size: {
      type: Number,
      default: "", 
    },
    bedrooms: {
      type: Number,
      default: "", 
    },
    bathrooms: {
      type: Number,
      default: "", 
    },
    parkings: {
      type: Number,
      default: "", 
    },
    additional_features: {
      type: String,
      default: "", 
    },
    furnished: {
      type: Boolean,
      default: false, 
    },
    description: {
      type: String,
      default: "", 
    },
    status: {
      type: String,
      default: "", 
    },
    availability: {
      type: String,
      default: "", 
    },
    price: {
      type: Number,
      required: [true, "Please add a password"],
    },
    rented_by: {
      type: String,
      default: "", 
    },
    address:{
      type:String,
      default:""
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rent", rentSchema);
