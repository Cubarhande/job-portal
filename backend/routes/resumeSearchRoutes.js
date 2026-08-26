const express = require("express");

const { searchCandidates } = require("../controllers/resumeSearchController");

const router = express.Router();

router.get("/", searchCandidates);

module.exports = router;
