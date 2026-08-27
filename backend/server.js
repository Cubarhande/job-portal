const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

const candidateRoutes = require("./routes/candidateRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const resumeSearchRoutes = require("./routes/resumeSearchRoutes");
const jobRoutes = require("./routes/jobRoutes");
const jobMatchRoutes = require("./routes/jobMatchRoutes");
const candidateActivityRoutes = require("./routes/candidateActivityRoutes");
const aiCallRoutes = require("./routes/aiCallRoutes");
const callScriptRoutes = require("./routes/callScriptRoutes");

 const interviewRoutes = require("./routes/interviewRoutes");
const documentRoutes = require("./routes/documentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const settingRoutes = require("./routes/settingRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Recruitment Portal API is running",
  });
});

app.use("/api/candidates", candidateRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/resume-search", resumeSearchRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/job-matches", jobMatchRoutes);
app.use("/api/candidate-activities", candidateActivityRoutes);
app.use("/api/ai-calls", aiCallRoutes);
app.use("/api/call-scripts", callScriptRoutes);
app.use("/api/candidates", candidateRoutes);
 
app.use("/api/interviews", interviewRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/settings", settingRoutes);
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
