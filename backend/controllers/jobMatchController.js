const Job = require("../models/Job");
const Candidate = require("../models/Candidate");
const Resume = require("../models/Resume");

const calculateMatchScore =
  require(
    "../services/matchScoreService"
  );


const matchCandidatesToJob =
  async (req, res) => {
    try {
      const job =
        await Job.findById(
          req.params.jobId
        ).lean();

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      const candidates =
        await Candidate.find({
          status: {
            $nin: [
              "Rejected",
              "Hired",
            ],
          },
        }).lean();

      const results = [];

      for (const candidate of candidates) {
        const resume =
          await Resume.findOne({
            candidate:
              candidate._id,
            isCurrent: true,
          }).lean();

        const match =
          calculateMatchScore(
            candidate,
            job,
            resume
          );

        results.push({
          candidate,
          score: match.score,
          matchedSkills:
            match.matchedSkills,
          reasons: match.reasons,
        });
      }

      results.sort(
        (a, b) =>
          b.score - a.score
      );

      res.json({
        success: true,

        job: {
          id: job._id,
          title: job.title,
          jobCode: job.jobCode,
        },

        count: results.length,

        data: results,
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
  matchCandidatesToJob,
};