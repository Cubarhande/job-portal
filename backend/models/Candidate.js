const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    // =========================
    // Personal Information
    // =========================

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================
    // Professional Information
    // =========================

    currentPosition: {
      type: String,
      default: "",
      trim: true,
    },

    currentCompany: {
      type: String,
      default: "",
      trim: true,
    },

    experience: {
      type: Number,
      default: 0,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    currentSalary: {
      type: Number,
      default: 0,
    },

    expectedSalary: {
      type: Number,
      default: 0,
    },

    noticePeriod: {
      type: Number,
      default: 90,
    },

    // =========================
    // Recruitment Status
    // =========================

    status: {
      type: String,

      enum: [
        "New",
        "Screening",
        "Technical Screening",
        "Submitted",
        "Interview",
        "Selected",
        "Rejected",
        "On Hold",
        "Hired",
        "Onboarding",
      ],

      default: "New",
    },

    // =========================
    // Detailed Recruitment Stage
    // =========================

    stage: {
      type: String,

      enum: [
        "New",
        "Discovery Call",
        "AI Screening",
        "Technical Test",
        "Technical Screening",
        "Submitted",
        "Interview Scheduled",
        "Pre-Interview",
        "Interview",
        "Post-Interview",
        "Selected",
        "Rejected",
        "Hiring",
        "Onboarding",
      ],

      default: "New",
    },

    // =========================
    // Current Job
    // =========================

    currentJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },

    // =========================
    // Recruiter Information
    // =========================

    recruiterNotes: {
      type: String,
      default: "",
    },

    nextAction: {
      type: String,
      default: "",
    },

    nextActionDate: {
      type: Date,
      default: null,
    },

    // =========================
    // Availability
    // =========================

    availabilityStatus: {
      type: String,

      enum: [
        "Available",
        "Notice Period",
        "Not Available",
      ],

      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Candidate",
  candidateSchema
);