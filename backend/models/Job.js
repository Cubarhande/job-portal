const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    jobCode: {
      type: String,
      unique: true,
      trim: true,
    },

    client: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    preferredSkills: {
      type: [String],
      default: [],
    },

    minExperience: {
      type: Number,
      default: 0,
    },

    maxExperience: {
      type: Number,
      default: 0,
    },

    location: {
      type: String,
      default: "",
    },

    workMode: {
      type: String,
      enum: [
        "Onsite",
        "Remote",
        "Hybrid",
      ],
      default: "Onsite",
    },

    employmentType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Contract",
        "Internship",
      ],
      default: "Full Time",
    },

    salaryMin: {
      type: Number,
      default: 0,
    },

    salaryMax: {
      type: Number,
      default: 0,
    },

    noticePeriod: {
      type: String,
      default: "",
    },

    openings: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "Open",
        "On Hold",
        "Closed",
      ],
      default: "Draft",
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Urgent",
      ],
      default: "Medium",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model("Job", jobSchema);