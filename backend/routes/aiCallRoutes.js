const express = require("express");

const {
  getAICalls,
  getAICall,
  createAICall,
  createBulkAICalls,
  updateAICall,
  deleteAICall,
} = require("../controllers/aiCallController");

const router = express.Router();

// GET all calls
router.get("/", getAICalls);

// GET single call
router.get("/:id", getAICall);

// CREATE single call
router.post("/", createAICall);

// CREATE bulk calls
router.post("/bulk", createBulkAICalls);

// UPDATE call
router.put("/:id", updateAICall);

// DELETE call
router.delete("/:id", deleteAICall);

module.exports = router;
