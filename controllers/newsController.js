const asyncHandler = require("express-async-handler");
const News = require("../models/newsModel");

// @desc Get all off-plan properties
// @route GET /api/offplan
// @access Public
const getNews = asyncHandler(async (req, res) => {
  try {
    const news = await News.findOne();
    if (!news) {
      // If no news is found, send a 404 Not Found response.
      res.status(404).send("No news found");
      return;
    }
    res.status(201).send(news);
  } catch (error) {
    res.status(500).send(error);
  }
});

const createNews = async (req, res) => {
  try {
    // Create a new news item
    const newsItem = new News({
      title: "default Title",
      description: "default Description",
    });
    // Save the news item to the database
    await newsItem.save();
    // Respond with the created news item
    res.status(201).json(newsItem);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateNews = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title && !description) {
      return res
        .status(400)
        .json({ message: "Title or content is required for update" });
    }

    const newsItem = await News.findOne();

    if (!newsItem) {
      return res.status(404).json({ message: "News item not found" });
    }
    if (title) {
      newsItem.title = title;
    }
    if (description) {
      newsItem.description = description;
    }
    await newsItem.save();
    res.status(201).json(newsItem);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createNews, getNews, updateNews };
