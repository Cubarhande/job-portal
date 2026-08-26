const express = require("express");

const {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  updateCandidateStage,
} = require("../controllers/candidateController");

const router = express.Router();

router.get("/", getCandidates);

router.get("/:id", getCandidate);

router.post("/", createCandidate);

router.put("/:id", updateCandidate);

router.delete("/:id", deleteCandidate);
router.patch("/:id/stage", updateCandidateStage);
module.exports = router;
