const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

//Cloudinary connection
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
 async function processAndUploadImage(imagePath) {
  try {
    // Process the image using Sharp
    

    // Upload the processed image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imagePath,{format: 'jpg',});
    return {url:uploadResult.url,public_id:uploadResult.public_id};
  } catch (error) {
    console.error(`Error processing/uploading image: ${error.message}`);
    throw error;
  }
}

module.exports = {
    processAndUploadImage
  };