const Candidate = require("../models/Candidate");
const CandidateActivity = require("../models/CandidateActivity");

// GET all candidates
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET single candidate
const getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE candidate
const createCandidate = async (req, res) => {
  try {
    const candidateData = {
      ...req.body,

      experience:
        Number(req.body.experience) || 0,

      expectedSalary:
        Number(req.body.expectedSalary) || 0,

      noticePeriod:
        Number(req.body.noticePeriod) || 90,

      status:
        req.body.status || "New",

      stage:
        req.body.stage || "New",

      skills:
        Array.isArray(req.body.skills)
          ? req.body.skills
          : [],
    };

    const candidate =
      await Candidate.create(candidateData);

    res.status(201).json({
      success: true,
      message:
        "Candidate created successfully",
      data: candidate,
    });
  } catch (error) {
    console.error(
      "CREATE CANDIDATE ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE candidate
const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      data: candidate,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE candidate
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCandidateStage =
  async (req, res) => {
    try {
      const {
        stage,
        note,
        jobId,
      } = req.body;

      if (!stage) {
        return res.status(400).json({
          success: false,
          message: "Stage is required",
        });
      }

      const candidate =
        await Candidate.findById(
          req.params.id
        );

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message:
            "Candidate not found",
        });
      }

      const oldStage =
        candidate.stage;

      // Update detailed stage
      candidate.stage = stage;

      // Update high-level status
      const statusMap = {
        "New": "New",
        "Discovery Call": "Screening",
        "AI Screening": "Screening",
        "Technical Test":
          "Technical Screening",
        "Technical Screening":
          "Technical Screening",
        "Submitted": "Submitted",
        "Interview Scheduled":
          "Interview",
        "Pre-Interview":
          "Interview",
        "Interview": "Interview",
        "Post-Interview":
          "Interview",
        "Selected": "Selected",
        "Rejected": "Rejected",
        "Hiring": "Hired",
        "Onboarding":
          "Onboarding",
      };

      candidate.status =
        statusMap[stage] ||
        candidate.status;

      // Update current job
      if (jobId) {
        candidate.currentJob =
          jobId;
      }

      await candidate.save();

      // Activity history
      await CandidateActivity.create({
        candidate:
          candidate._id,

        job:
          jobId ||
          candidate.currentJob ||
          null,

        type: "Stage Change",

        title:
          `Candidate moved to ${stage}`,

        description:
          note ||
          `Stage changed from ${oldStage} to ${stage}`,

        oldStage,

        newStage: stage,
      });

      res.json({
        success: true,

        message:
          "Candidate stage updated",

        data: candidate,
      });
    } catch (error) {
      console.error(
        "UPDATE CANDIDATE STAGE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  updateCandidateStage,
};
