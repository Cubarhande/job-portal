const express = require("express");

const upload = require("../middleware/uploadResume");

const {
  uploadResume,
  getCandidateResumes,
} = require("../controllers/resumeController");

const router = express.Router();

// ========================================
// Upload Resume
// POST /api/resumes/candidate/:candidateId
// ========================================

router.post("/candidate/:candidateId", upload.single("resume"), uploadResume);

// ========================================
// Get Resume History
// GET /api/resumes/candidate/:candidateId
// ========================================

router.get("/candidate/:candidateId", getCandidateResumes);

module.exports = router;
