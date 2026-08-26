const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Resume", "Contract", "Offer Letter", "Certificate", "Other"],
      default: "Other",
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      default: null,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      default: "",
    },

    fileSize: {
      type: Number,
      default: 0,
    },

    mimeType: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports =  mongoose.models.Document || mongoose.model("Document", documentSchema);
