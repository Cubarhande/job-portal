const express = require("express");

const { matchCandidatesToJob } = require("../controllers/jobMatchController");

const router = express.Router();

router.get("/:jobId", matchCandidatesToJob);

module.exports = router;
