const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/documents");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const name = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-");

    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const documentUpload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = {
  documentUpload,
};
