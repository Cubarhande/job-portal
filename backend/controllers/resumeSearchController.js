const Candidate = require("../models/Candidate");
const Resume = require("../models/Resume");

const searchCandidates = async (req, res) => {
  try {
    const {
      keyword = "",
      location,
      minExperience,
      maxExperience,
      minSalary,
      maxSalary,
      noticePeriod,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // -------------------------
    // Keyword Search
    // -------------------------

    if (keyword.trim()) {
      const keywords = keyword.split(/[,\s]+/).filter(Boolean);

      query.$or = [];

      keywords.forEach((word) => {
        const regex = new RegExp(word, "i");

        query.$or.push(
          { firstName: regex },
          { lastName: regex },
          { currentPosition: regex },
          { currentCompany: regex },
          { location: regex },
          { skills: regex },
        );
      });
    }

    // -------------------------
    // Location
    // -------------------------

    if (location) {
      query.location = new RegExp(location, "i");
    }

    // -------------------------
    // Experience
    // -------------------------

    if (minExperience || maxExperience) {
      query.experience = {};

      if (minExperience) {
        query.experience.$gte = Number(minExperience);
      }

      if (maxExperience) {
        query.experience.$lte = Number(maxExperience);
      }
    }

    // -------------------------
    // Salary
    // -------------------------

    if (minSalary || maxSalary) {
      query.expectedSalary = {};

      if (minSalary) {
        query.expectedSalary.$gte = Number(minSalary);
      }

      if (maxSalary) {
        query.expectedSalary.$lte = Number(maxSalary);
      }
    }

    // -------------------------
    // Notice Period
    // -------------------------

    if (noticePeriod) {
      query.noticePeriod = {
        $lte: Number(noticePeriod),
      };
    }

    // -------------------------
    // Status
    // -------------------------

    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const candidates = await Candidate.find(query)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Candidate.countDocuments(query);

    res.status(200).json({
      success: true,

      data: candidates,

      pagination: {
        total,

        page: Number(page),

        limit: Number(limit),

        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  searchCandidates,
};
