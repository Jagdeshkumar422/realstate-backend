var multer = require("multer");
const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("invalid image file or type", false);
  }
};

var uploads = multer({ storage, fileFilter });

module.exports=uploads