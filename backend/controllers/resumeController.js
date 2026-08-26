const Candidate = require("../models/Candidate");
const Resume = require("../models/Resume");
const CandidateActivity = require("../models/CandidateActivity");
const { parseCandidateResume } = require("../services/candidateParser");
const { extractResumeText } = require("../services/resumeParser");

// ========================================
// Upload Resume
// ========================================

const uploadResume = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    // Extract text from PDF / DOCX
    const extractedText = await extractResumeText(req.file.path);
const parsedCandidate =
  parseCandidateResume(
    extractedText
  );

console.log(
  "Parsed candidate:",
  parsedCandidate
);
const candidateUpdate = {};

if (
  parsedCandidate.email &&
  !candidate.email
) {
  candidateUpdate.email =
    parsedCandidate.email;
}

if (
  parsedCandidate.phone &&
  !candidate.phone
) {
  candidateUpdate.phone =
    parsedCandidate.phone;
}

if (
  parsedCandidate.experience !==
  null
) {
  candidateUpdate.experience =
    parsedCandidate.experience;
}

if (
  parsedCandidate.skills.length
) {
  candidateUpdate.skills =
    parsedCandidate.skills;
}

if (
  parsedCandidate.location
) {
  candidateUpdate.location =
    parsedCandidate.location;
}

if (
  parsedCandidate.currentPosition
) {
  candidateUpdate.currentPosition =
    parsedCandidate.currentPosition;
}
if (
  Object.keys(candidateUpdate)
    .length
) {
  await Candidate.findByIdAndUpdate(
    candidateId,
    {
      $set: candidateUpdate,
    },
    {
      new: true,
    }
  );
}
    // Get previous resumes
    const previousResumes = await Resume.find({
      candidate: candidateId,
    }).sort({
      version: -1,
    });

    // Mark previous resume as old
    await Resume.updateMany(
      {
        candidate: candidateId,
      },
      {
        $set: {
          isCurrent: false,
        },
      },
    );

    const version = previousResumes.length + 1;

    // Create new resume
    const resume = await Resume.create({
      candidate: candidateId,

      fileName: req.file.filename,

      originalName: req.file.originalname,

      filePath: req.file.path,

      fileType: req.file.mimetype,
      fileSize: req.file.size,

      extractedText,

      version,

      isCurrent: true,
    });

    // Activity
    await CandidateActivity.create({
      candidate: candidateId,

      type: "Resume",

      title: "Resume uploaded",

      description: `${req.file.originalname} uploaded as version ${version}`,
    });

    return res.status(201).json({
      success: true,

      message: "Resume uploaded successfully",

      data: resume,
      parsedCandidate,
    });
  } catch (error) {
    console.error("UPLOAD RESUME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// Get Candidate Resume History
// ========================================

const getCandidateResumes = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const resumes = await Resume.find({
      candidate: candidateId,
    }).sort({
      version: -1,
    });

    return res.json({
      success: true,

      count: resumes.length,

      data: resumes,
    });
  } catch (error) {
    console.error("GET RESUMES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadResume,
  getCandidateResumes,
};
