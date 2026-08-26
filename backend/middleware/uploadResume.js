const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory =
  path.join(
    __dirname,
    "../uploads/resumes"
  );

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage =
  multer.diskStorage({
    destination: function (
      req,
      file,
      cb
    ) {
      cb(null, uploadDirectory);
    },

    filename: function (
      req,
      file,
      cb
    ) {
      const extension =
        path.extname(
          file.originalname
        );

      const name =
        path.basename(
          file.originalname,
          extension
        )
          .replace(
            /[^a-zA-Z0-9]/g,
            "-"
          )
          .toLowerCase();

      cb(
        null,
        `${name}-${Date.now()}${extension}`
      );
    },
  });

const fileFilter =
  (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF and DOCX files are allowed"
        )
      );
    }
  };

const upload =
  multer({
    storage,
    fileFilter,
    limits: {
      fileSize:
        5 * 1024 * 1024,
    },
  });

module.exports = upload;