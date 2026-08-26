const mongoose = require("mongoose");

const candidateActivitySchema =
  new mongoose.Schema(
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
        enum: [
          "Stage Change",
          "Call",
          "AI Call",
          "Interview",
          "Test",
          "Note",
          "Resume",
          "Submission",
          "Email",
          "SMS",
          "Hiring",
          "Onboarding",
        ],
        default: "Note",
      },

      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        default: "",
      },

      oldStage: {
        type: String,
        default: "",
      },

      newStage: {
        type: String,
        default: "",
      },

      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "CandidateActivity",
    candidateActivitySchema
  );