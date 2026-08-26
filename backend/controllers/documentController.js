const Document = require("../models/Document");

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("candidate", "firstName lastName email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error("GET DOCUMENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate(
      "candidate",
      "firstName lastName email",
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      data: document,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    const { name, type, candidate, description } = req.body;

    let candidateId = null;

    if (candidate && candidate.trim()) {
      candidateId = candidate.trim();
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const document = await Document.create({
      name: name || req.file.originalname,

      type: type || "Other",

      candidate: candidateId,

      description: description || "",

      originalName: req.file.originalname,

      fileName: req.file.filename,

      filePath: req.file.path,

      url: `${baseUrl}/uploads/documents/${req.file.filename}`,

      fileSize: req.file.size,

      mimeType: req.file.mimetype,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error) {
    console.error("UPLOAD DOCUMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const fs = require("fs");

    if (document.filePath && fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("DELETE DOCUMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDocuments,
  getDocument,
  uploadDocument,
  deleteDocument,
};
