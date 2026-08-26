const express = require("express");

const {
  getInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview,
} = require("../controllers/interviewController");

const router = express.Router();

router.get("/", getInterviews);

router.get("/:id", getInterview);

router.post("/", createInterview);

router.put("/:id", updateInterview);

router.delete("/:id", deleteInterview);

module.exports = router;