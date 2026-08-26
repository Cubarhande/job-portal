const AICall = require("../models/AICall");
const Candidate = require("../models/Candidate");

// ========================================
// GET ALL AI CALLS
// ========================================

const getAICalls = async (req, res) => {
  try {
    const calls = await AICall.find()
      .populate(
        "candidate",
        "firstName lastName email phone currentPosition stage",
      )
      .populate("job", "title company")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: calls.length,
      data: calls,
    });
  } catch (error) {
    console.error("GET AI CALLS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET SINGLE AI CALL
// ========================================

const getAICall = async (req, res) => {
  try {
    const call = await AICall.findById(req.params.id)
      .populate(
        "candidate",
        "firstName lastName email phone currentPosition stage",
      )
      .populate("job", "title company");

    if (!call) {
      return res.status(404).json({
        success: false,
        message: "AI call not found",
      });
    }

    res.status(200).json({
      success: true,
      data: call,
    });
  } catch (error) {
    console.error("GET AI CALL ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// CREATE SINGLE AI CALL
// ========================================

const createAICall = async (req, res) => {
  try {
    const {
      candidateId,
      jobId,
      callType,
      scriptName,
      durationLimit,
      maxAttempts,
      scheduledAt,
      timezone,
    } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "candidateId is required",
      });
    }

    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (!candidate.phone) {
      return res.status(400).json({
        success: false,
        message: "Candidate does not have a phone number",
      });
    }

    const call = await AICall.create({
      candidate: candidate._id,

      job: jobId || null,

      callType: callType || "Single",

      scriptName: scriptName || "Initial Screening",

      durationLimit: Number(durationLimit) || 5,

      maxAttempts: Number(maxAttempts) || 3,

      attemptNumber: 1,

      phoneNumber: candidate.phone,

      timezone: timezone || "Asia/Kolkata",

      scheduledAt: scheduledAt || null,

      status: scheduledAt ? "Scheduled" : "Queued",
    });

    res.status(201).json({
      success: true,
      message: "AI call created successfully",
      data: call,
    });
  } catch (error) {
    console.error("CREATE AI CALL ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// CREATE BULK AI CALLS
// ========================================

const createBulkAICalls = async (req, res) => {
  try {
    const {
      candidateIds,
      jobId,
      scriptName,
      durationLimit,
      maxAttempts,
      scheduledAt,
      timezone,
    } = req.body;

    if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "candidateIds must be a non-empty array",
      });
    }

    const candidates = await Candidate.find({
      _id: {
        $in: candidateIds,
      },
    });

    if (!candidates.length) {
      return res.status(404).json({
        success: false,
        message: "No candidates found",
      });
    }

    const calls = [];

    for (const candidate of candidates) {
      if (!candidate.phone) {
        continue;
      }

      calls.push({
        candidate: candidate._id,

        job: jobId || null,

        callType: "Bulk",

        scriptName: scriptName || "Initial Screening",

        durationLimit: Number(durationLimit) || 5,

        maxAttempts: Number(maxAttempts) || 3,

        attemptNumber: 1,

        phoneNumber: candidate.phone,

        timezone: timezone || "Asia/Kolkata",

        scheduledAt: scheduledAt || null,

        status: scheduledAt ? "Scheduled" : "Queued",
      });
    }

    if (!calls.length) {
      return res.status(400).json({
        success: false,
        message: "Selected candidates do not have phone numbers",
      });
    }

    const createdCalls = await AICall.insertMany(calls);

    res.status(201).json({
      success: true,
      message: `${createdCalls.length} AI calls created successfully`,
      count: createdCalls.length,
      data: createdCalls,
    });
  } catch (error) {
    console.error("CREATE BULK AI CALL ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// UPDATE AI CALL
// ========================================

const updateAICall = async (req, res) => {
  try {
    const call = await AICall.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!call) {
      return res.status(404).json({
        success: false,
        message: "AI call not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "AI call updated successfully",
      data: call,
    });
  } catch (error) {
    console.error("UPDATE AI CALL ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// DELETE AI CALL
// ========================================

const deleteAICall = async (req, res) => {
  try {
    const call = await AICall.findByIdAndDelete(req.params.id);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: "AI call not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "AI call deleted successfully",
    });
  } catch (error) {
    console.error("DELETE AI CALL ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAICalls,
  getAICall,
  createAICall,
  createBulkAICalls,
  updateAICall,
  deleteAICall,
};
