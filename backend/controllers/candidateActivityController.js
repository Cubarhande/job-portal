const CandidateActivity = require("../models/CandidateActivity");

const getCandidateActivities = async (req, res) => {
  try {
    const activities = await CandidateActivity.find({
      candidate: req.params.candidateId,
    })
      .populate("job", "title jobCode")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error("GET CANDIDATE ACTIVITIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCandidateActivities,
};
