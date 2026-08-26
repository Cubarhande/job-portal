const CallScript = require("../models/CallScript");

// GET ALL SCRIPTS
const getCallScripts = async (req, res) => {
  try {
    const scripts = await CallScript.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: scripts.length,
      data: scripts,
    });
  } catch (error) {
    console.error(
      "GET CALL SCRIPTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE SCRIPT
const getCallScript = async (req, res) => {
  try {
    const script =
      await CallScript.findById(req.params.id);

    if (!script) {
      return res.status(404).json({
        success: false,
        message: "Call script not found",
      });
    }

    res.status(200).json({
      success: true,
      data: script,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE SCRIPT
const createCallScript = async (req, res) => {
  try {
    const script =
      await CallScript.create(req.body);

    res.status(201).json({
      success: true,
      message: "Call script created successfully",
      data: script,
    });
  } catch (error) {
    console.error(
      "CREATE CALL SCRIPT ERROR:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE SCRIPT
const updateCallScript = async (req, res) => {
  try {
    const script =
      await CallScript.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!script) {
      return res.status(404).json({
        success: false,
        message: "Call script not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Call script updated successfully",
      data: script,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE SCRIPT
const deleteCallScript = async (req, res) => {
  try {
    const script =
      await CallScript.findByIdAndDelete(
        req.params.id
      );

    if (!script) {
      return res.status(404).json({
        success: false,
        message: "Call script not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Call script deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// TOGGLE ACTIVE STATUS
const toggleCallScript = async (req, res) => {
  try {
    const script =
      await CallScript.findById(req.params.id);

    if (!script) {
      return res.status(404).json({
        success: false,
        message: "Call script not found",
      });
    }

    script.active = !script.active;

    await script.save();

    res.status(200).json({
      success: true,
      message: script.active
        ? "Call script activated"
        : "Call script deactivated",
      data: script,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCallScripts,
  getCallScript,
  createCallScript,
  updateCallScript,
  deleteCallScript,
  toggleCallScript,
};