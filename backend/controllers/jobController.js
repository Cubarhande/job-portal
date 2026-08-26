const Job = require("../models/Job");

// CREATE
const createJob = async (req, res) => {
  try {
    const {
      title,
      jobCode,
      client,
      description,
      requiredSkills,
      preferredSkills,
      minExperience,
      maxExperience,
      location,
      workMode,
      employmentType,
      salaryMin,
      salaryMax,
      noticePeriod,
      openings,
      status,
      priority,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Job title is required",
      });
    }

    if (!client) {
      return res.status(400).json({
        success: false,
        message: "Client is required",
      });
    }

    const job = await Job.create({
      title,
      jobCode,
      client,
      description,

      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],

      preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : [],

      minExperience: Number(minExperience) || 0,

      maxExperience: Number(maxExperience) || 0,

      location,

      workMode: workMode || "Onsite",

      employmentType: employmentType || "Full Time",

      salaryMin: Number(salaryMin) || 0,

      salaryMax: Number(salaryMax) || 0,

      noticePeriod,

      openings: Number(openings) || 1,

      status: status || "Draft",

      priority: priority || "Medium",
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ONE
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};
