const mongoose = require("mongoose");

const buySchema = mongoose.Schema(
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
      default: "Buy",
    },
    appartement_type: {
      type: String,
      required: [true, "Please add a type"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
    },
    image: [{ url: { type: String }, public_id: { type: String } }],
    location: {
      type: String,
      default: "",
    },
    floor: {
      type: Number,
      default: "",
    },
    size: {
      type: Number,
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
    neighborhood: {
      type: String,
      default: "",
    },
    hand_over_date: {
      type: String,
      default: "Soon",
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
      required: [true, "Please add a price"],
    },
    sold_to: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    whatsapp_number: {
      type: String,
      required: [true, "Please add a WhatsApp number"],
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt timestamps automatically
  }
);

module.exports = mongoose.model("Buy", buySchema);
