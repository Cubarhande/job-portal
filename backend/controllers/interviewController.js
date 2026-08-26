const Interview = require("../models/Interview");

// GET all interviews
const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate("candidate", "firstName lastName email phone currentPosition")
      .populate("job", "title company")
      .sort({
        scheduledAt: 1,
      });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    console.error("GET INTERVIEWS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET single interview
const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate("candidate")
      .populate("job");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error("GET INTERVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE interview
const createInterview = async (req, res) => {
  try {
    const {
      candidate,
      job,
      type,
      scheduledAt,
      duration,
      interviewer,
      location,
      meetingLink,
      notes,
      status,
    } = req.body;

    if (!candidate) {
      return res.status(400).json({
        success: false,
        message: "Candidate is required",
      });
    }

    if (!scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Interview date and time are required",
      });
    }

    if (!interviewer) {
      return res.status(400).json({
        success: false,
        message: "Interviewer is required",
      });
    }

    const interview = await Interview.create({
      candidate,
      job: job || null,
      type: type || "Video",
      scheduledAt,
      duration: Number(duration) || 60,
      interviewer,
      location: location || "",
      meetingLink: meetingLink || "",
      notes: notes || "",
      status: status || "Scheduled",
    });

    const populatedInterview = await Interview.findById(interview._id)
      .populate("candidate", "firstName lastName email phone currentPosition")
      .populate("job", "title company");

    res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      data: populatedInterview,
    });
  } catch (error) {
    console.error("CREATE INTERVIEW ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE interview
const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("candidate", "firstName lastName email phone currentPosition")
      .populate("job", "title company");

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      data: interview,
    });
  } catch (error) {
    console.error("UPDATE INTERVIEW ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE interview
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
    });
  } catch (error) {
    console.error("DELETE INTERVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview,
};
