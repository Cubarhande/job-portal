const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: "RecruitAI",
    },

    companyEmail: {
      type: String,
      default: "",
    },

    companyPhone: {
      type: String,
      default: "",
    },

    companyWebsite: {
      type: String,
      default: "",
    },

    companyAddress: {
      type: String,
      default: "",
    },

    defaultInterviewDuration: {
      type: Number,
      default: 30,
    },

    defaultNoticePeriod: {
      type: Number,
      default: 90,
    },

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    interviewNotifications: {
      type: Boolean,
      default: true,
    },

    aiCallNotifications: {
      type: Boolean,
      default: true,
    },

    darkMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Setting", settingSchema);