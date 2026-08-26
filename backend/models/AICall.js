const mongoose = require("mongoose");

const aiCallSchema = new mongoose.Schema(
  {
    // ==============================
    // Candidate
    // ==============================

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    // ==============================
    // Job
    // ==============================

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },

    // ==============================
    // Call Configuration
    // ==============================

    callType: {
      type: String,
      enum: ["Single", "Bulk"],
      default: "Single",
    },

    scriptName: {
      type: String,
      default: "Initial Screening",
    },

    durationLimit: {
      type: Number,
      default: 5,
    },

    maxAttempts: {
      type: Number,
      default: 3,
    },

    attemptNumber: {
      type: Number,
      default: 1,
    },

    // ==============================
    // Call Status
    // ==============================

    status: {
      type: String,
      enum: [
        "Queued",
        "Scheduled",
        "Calling",
        "Ringing",
        "Connected",
        "Completed",
        "No Answer",
        "Busy",
        "Failed",
        "Cancelled",
      ],
      default: "Queued",
    },

    // ==============================
    // Phone
    // ==============================

    phoneNumber: {
      type: String,
      default: "",
    },

    // ==============================
    // Timezone
    // ==============================

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    // ==============================
    // Scheduling
    // ==============================

    scheduledAt: {
      type: Date,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    durationSeconds: {
      type: Number,
      default: 0,
    },

    // ==============================
    // AI Conversation
    // ==============================

    transcript: {
      type: String,
      default: "",
    },

    recordingUrl: {
      type: String,
      default: "",
    },

    // ==============================
    // AI Result
    // ==============================

    aiScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    screeningResult: {
      type: String,
      default: "",
    },

    testResult: {
      type: String,
      default: "",
    },

    outcome: {
      type: String,
      default: "",
    },

    // ==============================
    // Callback
    // ==============================

    callbackAt: {
      type: Date,
      default: null,
    },

    smsSent: {
      type: Boolean,
      default: false,
    },

    // ==============================
    // DND
    // ==============================

    dndChecked: {
      type: Boolean,
      default: false,
    },

    dndBlocked: {
      type: Boolean,
      default: false,
    },

    // ==============================
    // Notes
    // ==============================

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("AICall", aiCallSchema);
