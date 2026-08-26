import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  PhoneCall,
  Clock,
  ExternalLink,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import API from "../services/api";
import CandidatePipeline from "../components/candidates/CandidatePipeline";
import CandidateActivityTimeline from "../components/candidates/CandidateActivityTimeline";

function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==============================
  // STATE
  // ==============================

  const [candidate, setCandidate] = useState(null);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [resumeHistory, setResumeHistory] = useState([]);

  const [updatingStage, setUpdatingStage] = useState(false);

  const [activities, setActivities] = useState([]);

  const [activityLoading, setActivityLoading] = useState(true);

  // ==============================
  // FETCH CANDIDATE
  // ==============================

  const fetchCandidate = async () => {
    try {
      const response = await API.get(`/candidates/${id}`);

      setCandidate(response.data.data);
    } catch (error) {
      console.error("FETCH CANDIDATE ERROR:", error.response?.data || error);
    }
  };

  // ==============================
  // FETCH RESUME HISTORY
  // ==============================

  const fetchResumeHistory = async () => {
    try {
      const response = await API.get(`/resumes/candidate/${id}`);

      setResumeHistory(response.data.data || []);
    } catch (error) {
      console.error("FETCH RESUME ERROR:", error.response?.data || error);

      setResumeHistory([]);
    }
  };

  // ==============================
  // FETCH ACTIVITIES
  // ==============================

  const fetchActivities = async () => {
    try {
      setActivityLoading(true);

      const response = await API.get(`/candidates/${id}/activities`);

      setActivities(response.data.data || []);
    } catch (error) {
      console.error("FETCH ACTIVITIES ERROR:", error.response?.data || error);

      setActivities([]);
    } finally {
      setActivityLoading(false);
    }
  };

  // ==============================
  // LOAD ALL DATA
  // ==============================

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchCandidate(),
          fetchResumeHistory(),
          fetchActivities(),
        ]);
      } catch (error) {
        console.error("CANDIDATE PROFILE LOAD ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // ==============================
  // UPDATE CANDIDATE STAGE
  // ==============================

  const handleStageChange = async (stage) => {
    if (!candidate) return;

    try {
      setUpdatingStage(true);

      const response = await API.put(`/candidates/${id}/stage`, {
        stage,
        jobId: candidate.currentJob || null,
      });

      if (response.data.success) {
        setCandidate(response.data.data);

        // Refresh timeline
        await fetchActivities();
      }
    } catch (error) {
      console.error("UPDATE STAGE ERROR:", error.response?.data || error);

      alert(
        error.response?.data?.message || "Failed to update candidate stage",
      );
    } finally {
      setUpdatingStage(false);
    }
  };

  // ==============================
  // RESUME UPLOAD
  // ==============================

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file || !candidate) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or DOCX file.");

      event.target.value = "";
      return;
    }

    // Validate size - 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("Resume size must be less than 10MB.");

      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("resume", file);

      formData.append("candidateId", candidate._id);

      const response = await API.post("/resumes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Resume uploaded successfully.");

        // Refresh candidate data
        await fetchCandidate();

        // Refresh resume list
        await fetchResumeHistory();

        // Refresh activity
        await fetchActivities();
      }
    } catch (error) {
      console.error("RESUME UPLOAD ERROR:", error.response?.data || error);

      alert(error.response?.data?.message || "Resume upload failed.");
    } finally {
      setUploading(false);

      // Reset file input
      event.target.value = "";
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-slate-500">Loading candidate...</p>
        </div>
      </div>
    );
  }

  // ==============================
  // NOT FOUND
  // ==============================

  if (!candidate) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-medium text-red-700">Candidate not found.</p>

        <button
          onClick={() => navigate("/admin/candidates")}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  // ==============================
  // FULL NAME
  // ==============================

  const fullName = [candidate.firstName, candidate.lastName]
    .filter(Boolean)
    .join(" ");

  // ==============================
  // CURRENT RESUME
  // ==============================

  const currentResume =
    resumeHistory.find((resume) => resume.isCurrent) || resumeHistory[0];

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="space-y-6">
      {/* =================================
          BACK BUTTON
      ================================= */}

      <button
        onClick={() => navigate("/admin/candidates")}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft size={18} />
        Back to Candidates
      </button>

      {/* =================================
          CANDIDATE HEADER
      ================================= */}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Candidate info */}

          <div className="flex min-w-0 items-start gap-4">
            {/* Avatar */}

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-700">
              {candidate.firstName?.[0]}
              {candidate.lastName?.[0]}
            </div>

            {/* Details */}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {fullName}
                </h1>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                  {candidate.status || "New"}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                {candidate.currentPosition || "Candidate"}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} />

                  {candidate.location || "—"}
                </span>

                <span className="flex items-center gap-1.5">
                  <BriefcaseBusiness size={15} />
                  {candidate.experience || 0} years
                </span>

                {candidate.currentCompany && (
                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness size={15} />

                    {candidate.currentCompany}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <PhoneCall size={17} />
              AI Call
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Edit
            </button>
          </div>
        </div>
      </section>

      {/* =================================
          RECRUITMENT PIPELINE
      ================================= */}

      <CandidatePipeline
        currentStage={candidate.stage || "New"}
        onStageChange={handleStageChange}
        updating={updatingStage}
      />

      {/* =================================
          MAIN CONTENT
      ================================= */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* =================================
            LEFT / MAIN
        ================================= */}

        <div className="space-y-6 lg:col-span-2">
          {/* =================================
              CONTACT INFORMATION
          ================================= */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-semibold text-slate-900">
              Contact Information
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <InfoItem
                icon={Mail}
                label="Email"
                value={candidate.email || "—"}
              />

              <InfoItem
                icon={Phone}
                label="Phone"
                value={candidate.phone || "—"}
              />

              <InfoItem
                icon={MapPin}
                label="Location"
                value={candidate.location || "—"}
              />

              <InfoItem
                icon={Clock}
                label="Notice Period"
                value={`${candidate.noticePeriod || 0} days`}
              />
            </div>
          </section>

          {/* =================================
              PROFESSIONAL INFORMATION
          ================================= */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-semibold text-slate-900">
              Professional Information
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <InfoItem
                icon={BriefcaseBusiness}
                label="Current Position"
                value={candidate.currentPosition || "—"}
              />

              <InfoItem
                icon={BriefcaseBusiness}
                label="Current Company"
                value={candidate.currentCompany || "—"}
              />

              <InfoItem
                icon={CalendarDays}
                label="Experience"
                value={`${candidate.experience || 0} years`}
              />

              <InfoItem
                icon={BriefcaseBusiness}
                label="Expected Salary"
                value={
                  candidate.expectedSalary
                    ? Number(candidate.expectedSalary).toLocaleString()
                    : "—"
                }
              />
            </div>
          </section>

          {/* =================================
              SKILLS
          ================================= */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-semibold text-slate-900">Skills</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {candidate.skills?.length ? (
                candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">No skills added.</p>
              )}
            </div>
          </section>

          {/* =================================
              RESUME
          ================================= */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Resume</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current resume and resume history.
                </p>
              </div>

              <label
                className={`inline-flex cursor-pointer items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 ${
                  uploading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                {uploading ? "Uploading..." : "Upload Resume"}

                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleResumeUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Current resume */}

            {currentResume && (
              <div className="mt-6 rounded-lg border border-indigo-100 bg-indigo-50/50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2 text-red-500 shadow-sm">
                      <FileText size={22} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {currentResume.originalName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Current Resume
                        {" • "}
                        Version {currentResume.version}
                      </p>
                    </div>
                  </div>

                  {currentResume.filePath && (
  <a
    href={`http://localhost:5000/${currentResume.filePath}`}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
  >
    <ExternalLink size={16} />
    View
  </a>
)}
                </div>
              </div>
            )}

            {/* Resume history */}

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-800">
                Resume History
              </h3>

              {resumeHistory.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-8 text-center">
                  <FileText size={32} className="mx-auto text-slate-400" />

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    No resume uploaded
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Upload a PDF or DOCX resume.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {resumeHistory.map((resume) => (
                    <div
                      key={resume._id}
                      className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="shrink-0 rounded-lg bg-red-50 p-2">
                          <FileText size={20} className="text-red-500" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {resume.originalName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Version {resume.version}
                            {" • "}
                            {resume.fileSize
                              ? (resume.fileSize / 1024 / 1024).toFixed(2)
                              : "0"}{" "}
                            MB
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {resume.isCurrent && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                            Current
                          </span>
                        )}

                        {resume.createdAt && (
                          <span className="text-xs text-slate-400">
                            {new Date(resume.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* =================================
            RIGHT SIDEBAR
        ================================= */}

        <div className="space-y-6">
          {/* =================================
              AI MATCH SCORE
          ================================= */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-semibold text-slate-900">AI Match Score</h2>

            <div className="mt-5 flex justify-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-indigo-100">
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">0%</p>

                  <p className="text-xs text-slate-500">Not analyzed</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-lg bg-indigo-50 py-2.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
            >
              Analyze with AI
            </button>
          </section>

          {/* =================================
              QUICK DETAILS
          ================================= */}

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-semibold text-slate-900">Quick Details</h2>

            <div className="mt-5 space-y-4">
              <QuickDetail label="Status" value={candidate.status || "New"} />

              <QuickDetail label="Stage" value={candidate.stage || "New"} />

              <QuickDetail
                label="Availability"
                value={candidate.availabilityStatus || "Available"}
              />

              <QuickDetail
                label="Notice Period"
                value={`${candidate.noticePeriod || 0} days`}
              />
            </div>
          </section>
        </div>
      </div>

      {/* =================================
          ACTIVITY TIMELINE
      ================================= */}

      <CandidateActivityTimeline
        activities={activities}
        loading={activityLoading}
      />
    </div>
  );
}

// ========================================
// INFO ITEM
// ========================================

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 gap-3">
      <div className="shrink-0 rounded-lg bg-slate-100 p-2">
        <Icon size={17} className="text-slate-500" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>

        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

// ========================================
// QUICK DETAIL
// ========================================

function QuickDetail({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}

export default CandidateProfile;
