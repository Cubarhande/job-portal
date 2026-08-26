const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },

    type: {
      type: String,
      enum: ["Video", "Phone", "In Person", "Technical"],
      default: "Video",
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      default: 60,
    },

    interviewer: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    meetingLink: {
      type: String,
      default: "",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Interview", interviewSchema);
