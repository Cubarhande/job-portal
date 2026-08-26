const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "General",
        "Technical",
        "Experience",
        "Salary",
        "Availability",
        "Notice Period",
        "Location",
        "Yes/No",
      ],
      default: "General",
    },

    required: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const callScriptSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    callType: {
      type: String,
      enum: [
        "Discovery Call",
        "AI Screening",
        "Technical Screening",
        "Interview Reminder",
        "Pre-Interview",
        "Post-Interview",
        "Hiring Call",
        "Onboarding Call",
      ],
      required: true,
    },

    introduction: {
      type: String,
      required: true,
    },

    aiInstructions: {
      type: String,
      default: "",
    },

    questions: [questionSchema],

    closingMessage: {
      type: String,
      default:
        "Thank you for your time. Our recruitment team will contact you with the next steps.",
    },

    maxDuration: {
      type: Number,
      default: 10,
    },

    maxAttempts: {
      type: Number,
      default: 3,
    },

    smsAfterAttempts: {
      type: Boolean,
      default: true,
    },

    smsMessage: {
      type: String,
      default:
        "We tried contacting you regarding a recruitment opportunity. Please contact our recruitment team when convenient.",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    startTime: {
      type: String,
      default: "09:00",
    },

    endTime: {
      type: String,
      default: "18:00",
    },

    respectDND: {
      type: Boolean,
      default: true,
    },

    respectHolidays: {
      type: Boolean,
      default: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CallScript",
  callScriptSchema
);