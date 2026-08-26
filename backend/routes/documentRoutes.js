const express = require("express");

const {
  getDocuments,
  getDocument,
  uploadDocument,
  deleteDocument,
} = require("../controllers/documentController");

const { documentUpload } = require("../middleware/upload");

const router = express.Router();

// GET /api/documents
router.get("/", getDocuments);

// GET /api/documents/:id
router.get("/:id", getDocument);

// POST /api/documents
router.post("/", documentUpload.single("file"), uploadDocument);

// DELETE /api/documents/:id
router.delete("/:id", deleteDocument);

module.exports = router;
