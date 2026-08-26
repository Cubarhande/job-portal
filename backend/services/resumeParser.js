const fs = require("fs");
const path = require("path");

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractResumeText(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  // PDF
  if (extension === ".pdf") {
    const buffer = fs.readFileSync(filePath);

    const data = await pdfParse(buffer);

    return data.text || "";
  }

  // DOCX
  if (extension === ".docx") {
    const result = await mammoth.extractRawText({
      path: filePath,
    });

    return result.value || "";
  }

  throw new Error("Only PDF and DOCX resumes are supported");
}

module.exports = {
  extractResumeText,
};
