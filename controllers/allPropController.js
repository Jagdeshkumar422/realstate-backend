const asyncHandler = require("express-async-handler");
const Buy = require("../models/buyModel");
const Rent = require("../models/rentModel");


const getPropertyById = asyncHandler(async (req, res) => {
  const { type, id } = req.params;

  try {
    let property;

    switch (type) {
      case "Buy":
        property = await Buy.findById(id);
        break;
      case "Rent":
        property = await Rent.findById(id);
        break;
      default:
        return res.status(400).send("Invalid property type");
    }

    if (!property) {
      return res.status(404).send("Property not found");
    }

    res.send(property);
  } catch (error) {
    res.status(500).send(error);
  }
});


const getLatestProperties = asyncHandler(async (req, res) => {
  try {
    const offPlanProperties = await Rent.find().sort({ _id: -1 }).limit(4);

    const properties = [...offPlanProperties];

    res.send(properties);
  } catch (error) {
    res.status(500).send(error);
  }
});



module.exports = {
  getPropertyById,
  getLatestProperties
};
