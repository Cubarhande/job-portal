import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  Search,
  Plus,
  Video,
  Phone,
  MapPin,
  User,
  MoreVertical,
  X,
  CheckCircle2,
  XCircle,
  CalendarCheck,
} from "lucide-react";

import API from "../services/api";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    candidate: "",
    job: "",
    type: "Video",
    scheduledAt: "",
    duration: 60,
    interviewer: "",
    location: "",
    meetingLink: "",
    notes: "",
    status: "Scheduled",
  };

  const [form, setForm] = useState(initialForm);

  // ========================================
  // FETCH INTERVIEWS
  // ========================================

  const fetchInterviews = async () => {
    try {
      setLoading(true);

      const response = await API.get("/interviews");

      setInterviews(response.data.data || []);
    } catch (error) {
      console.error(
        "FETCH INTERVIEWS ERROR:",
        error.response?.data || error,
      );

      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // FETCH CANDIDATES
  // ========================================

  const fetchCandidates = async () => {
    try {
      const response = await API.get("/candidates");

      setCandidates(response.data.data || []);
    } catch (error) {
      console.error(
        "FETCH CANDIDATES ERROR:",
        error.response?.data || error,
      );
    }
  };

  useEffect(() => {
    fetchInterviews();
    fetchCandidates();
  }, []);

  // ========================================
  // FILTER
  // ========================================

  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      const candidateName = item.candidate
        ? `${item.candidate.firstName || ""} ${
            item.candidate.lastName || ""
          }`
        : "";

      const text = `
        ${candidateName}
        ${item.interviewer || ""}
        ${item.type || ""}
        ${item.status || ""}
      `.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [interviews, search, statusFilter]);

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // CREATE INTERVIEW
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.candidate) {
      alert("Please select a candidate.");
      return;
    }

    if (!form.interviewer.trim()) {
      alert("Please enter interviewer name.");
      return;
    }

    if (!form.scheduledAt) {
      alert("Please select interview date and time.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        candidate: form.candidate,

        // Send empty string as null
        job: form.job || null,

        type: form.type,

        // IMPORTANT
        scheduledAt: new Date(form.scheduledAt).toISOString(),

        duration: Number(form.duration) || 60,

        interviewer: form.interviewer.trim(),

        location: form.location.trim(),

        meetingLink: form.meetingLink.trim(),

        notes: form.notes.trim(),

        status: form.status,
      };

      console.log("CREATE INTERVIEW PAYLOAD:", payload);

      const response = await API.post(
        "/interviews",
        payload,
      );

      if (response.data.success) {
        alert("Interview scheduled successfully.");

        setForm(initialForm);

        setShowModal(false);

        await fetchInterviews();
      }
    } catch (error) {
      console.error(
        "CREATE INTERVIEW ERROR:",
        error.response?.data || error,
      );

      alert(
        error.response?.data?.message ||
          "Failed to schedule interview.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // STATUS UPDATE
  // ========================================

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/interviews/${id}`, {
        status,
      });

      await fetchInterviews();
    } catch (error) {
      console.error(
        "UPDATE INTERVIEW ERROR:",
        error.response?.data || error,
      );

      alert(
        error.response?.data?.message ||
          "Failed to update interview.",
      );
    }
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  };

  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Interviews
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Schedule and manage candidate interviews.
          </p>
        </div>

        <button
          onClick={() => {
            setForm(initialForm);
            setShowModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={18} />
          Schedule Interview
        </button>
      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Total Interviews"
          value={interviews.length}
          icon={CalendarDays}
        />

        <StatCard
          title="Scheduled"
          value={
            interviews.filter(
              (item) =>
                item.status === "Scheduled",
            ).length
          }
          icon={CalendarCheck}
        />

        <StatCard
          title="Completed"
          value={
            interviews.filter(
              (item) =>
                item.status === "Completed",
            ).length
          }
          icon={CheckCircle2}
        />

        <StatCard
          title="Cancelled"
          value={
            interviews.filter(
              (item) =>
                item.status === "Cancelled",
            ).length
          }
          icon={XCircle}
        />

      </div>

      {/* FILTER */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="grid gap-3 md:grid-cols-[1fr_180px]">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search candidate or interviewer..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          >
            <option value="All">
              All Status
            </option>

            <option value="Scheduled">
              Scheduled
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

            <option value="Rescheduled">
              Rescheduled
            </option>
          </select>

        </div>

      </div>

      {/* INTERVIEW LIST */}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading interviews...
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="p-10 text-center">

            <CalendarDays
              size={40}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-medium text-slate-700">
              No interviews found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Schedule your first candidate interview.
            </p>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {filteredInterviews.map((item) => {

              const candidateName =
                item.candidate
                  ? `${item.candidate.firstName || ""} ${
                      item.candidate.lastName || ""
                    }`
                  : "Unknown Candidate";

              return (
                <div
                  key={item._id}
                  className="flex flex-col gap-5 p-5 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
                >

                  <div className="flex min-w-0 gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <CalendarDays size={21} />
                    </div>

                    <div className="min-w-0">

                      <h3 className="font-semibold text-slate-900">
                        {candidateName}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">

                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {formatDate(
                            item.scheduledAt,
                          )}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {formatTime(
                            item.scheduledAt,
                          )}
                        </span>

                        <span className="flex items-center gap-1.5">

                          {item.type === "Phone" ? (
                            <Phone size={14} />
                          ) : item.type === "In Person" ? (
                            <MapPin size={14} />
                          ) : (
                            <Video size={14} />
                          )}

                          {item.type || "Video"}

                        </span>

                        <span className="flex items-center gap-1.5">
                          <User size={14} />
                          {item.interviewer ||
                            "Not assigned"}
                        </span>

                      </div>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <StatusBadge
                      status={
                        item.status ||
                        "Scheduled"
                      }
                    />

                    <button
                      onClick={() =>
                        updateStatus(
                          item._id,
                          item.status ===
                            "Completed"
                            ? "Scheduled"
                            : "Completed",
                        )
                      }
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Change status"
                    >
                      <MoreVertical size={18} />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 p-5">

              <div>
                <h2 className="font-semibold text-slate-900">
                  Schedule Interview
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Create a new candidate interview.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >

              {/* CANDIDATE */}

              <div>
                <label className="label">
                  Candidate
                </label>

                <select
                  name="candidate"
                  value={form.candidate}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option value="">
                    Select candidate
                  </option>

                  {candidates.map(
                    (candidate) => (
                      <option
                        key={candidate._id}
                        value={candidate._id}
                      >
                        {candidate.firstName}{" "}
                        {candidate.lastName}
                      </option>
                    ),
                  )}

                </select>
              </div>

              {/* INTERVIEWER + TYPE */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="label">
                    Interviewer
                  </label>

                  <input
                    name="interviewer"
                    value={
                      form.interviewer
                    }
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    Interview Type
                  </label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="Video">
                      Video
                    </option>

                    <option value="Phone">
                      Phone
                    </option>

                    <option value="In Person">
                      In Person
                    </option>

                    <option value="Technical">
                      Technical
                    </option>
                  </select>
                </div>

              </div>

              {/* DATE + TIME */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="label">
                    Date & Time
                  </label>

                  <input
                    type="datetime-local"
                    name="scheduledAt"
                    value={
                      form.scheduledAt
                    }
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    Duration
                  </label>

                  <select
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="30">
                      30 minutes
                    </option>

                    <option value="45">
                      45 minutes
                    </option>

                    <option value="60">
                      60 minutes
                    </option>

                    <option value="90">
                      90 minutes
                    </option>

                    <option value="120">
                      120 minutes
                    </option>
                  </select>
                </div>

              </div>

              {/* LOCATION */}

              <div>
                <label className="label">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Office location"
                  className="input"
                />
              </div>

              {/* MEETING LINK */}

              <div>
                <label className="label">
                  Meeting Link
                </label>

                <input
                  name="meetingLink"
                  value={
                    form.meetingLink
                  }
                  onChange={handleChange}
                  placeholder="https://meet.google.com/..."
                  className="input"
                />
              </div>

              {/* NOTES */}

              <div>
                <label className="label">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Interview notes..."
                  className="input resize-none"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving
                    ? "Scheduling..."
                    : "Schedule Interview"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      <style>{`
        .label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #334155;
        }

        .input {
          width: 100%;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
        }

        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px #e0e7ff;
        }
      `}</style>

    </div>
  );
}

// ========================================
// STAT CARD
// ========================================

function StatCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon size={20} />
        </div>

      </div>

    </div>
  );
}

// ========================================
// STATUS BADGE
// ========================================

function StatusBadge({ status }) {
  const classes = {
    Scheduled:
      "bg-indigo-50 text-indigo-600",

    Completed:
      "bg-emerald-50 text-emerald-600",

    Cancelled:
      "bg-red-50 text-red-600",

    Rescheduled:
      "bg-amber-50 text-amber-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        classes[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default Interviews;