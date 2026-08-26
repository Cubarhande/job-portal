const express = require("express");

const {
  getCandidateActivities,
} = require("../controllers/candidateActivityController");

const router = express.Router();

router.get("/:candidateId", getCandidateActivities);

module.exports = router;
