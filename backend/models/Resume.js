const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      default: "",
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    extractedText: {
      type: String,
      default: "",
    },

    version: {
      type: Number,
      default: 1,
    },

    isCurrent: {
      type: Boolean,
      default: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Resume", resumeSchema);
