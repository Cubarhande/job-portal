import { useEffect, useState } from "react";
import {
  PhoneCall,
  Search,
  Play,
  Pause,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
} from "lucide-react";

import API from "../services/api";

function AICalls() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [callMode, setCallMode] = useState("single");
  const [calls, setCalls] = useState([]);
const [callsLoading, setCallsLoading] = useState(false);

  const [script, setScript] = useState({
    name: "Initial Screening",
    duration: 5,
    maxAttempts: 3,
    retryAfter: 24,
  });

  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const response = await API.get("/candidates");

      setCandidates(response.data.data || []);
    } catch (error) {
      console.error(
        "FETCH CANDIDATES ERROR:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);
const fetchCalls = async () => {
  try {
    setCallsLoading(true);

    const response =
      await API.get("/ai-calls");

    setCalls(
      response.data.data || []
    );
  } catch (error) {
    console.error(
      "FETCH AI CALLS ERROR:",
      error.response?.data || error
    );
  } finally {
    setCallsLoading(false);
  }
};
useEffect(() => {
  fetchCandidates();
  fetchCalls();
}, []);
  const filteredCandidates = candidates.filter((candidate) => {
    const text = `
      ${candidate.firstName}
      ${candidate.lastName}
      ${candidate.email}
      ${candidate.currentPosition}
      ${candidate.currentCompany}
      ${(candidate.skills || []).join(" ")}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const toggleCandidate = (id) => {
    setSelectedCandidates((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

const startCall = async () => {
  if (selectedCandidates.length === 0) {
    alert("Please select at least one candidate.");
    return;
  }

  try {
    if (callMode === "single") {
      const response = await API.post(
        "/ai-calls",
        {
          candidateId:
            selectedCandidates[0],

          callType: "Single",

          scriptName:
            script.name,

          durationLimit:
            script.duration,

          maxAttempts:
            script.maxAttempts,

          timezone:
            "Asia/Kolkata",
        }
      );

      if (response.data.success) {
        alert(
          "AI call created successfully."
        );

        setSelectedCandidates([]);

        await fetchCalls();
      }
    } else {
      const response = await API.post(
        "/ai-calls/bulk",
        {
          candidateIds:
            selectedCandidates,

          scriptName:
            script.name,

          durationLimit:
            script.duration,

          maxAttempts:
            script.maxAttempts,

          timezone:
            "Asia/Kolkata",
        }
      );

      if (response.data.success) {
        alert(
          response.data.message
        );

        setSelectedCandidates([]);

        await fetchCalls();
      }
    }
  } catch (error) {
    console.error(
      "START AI CALL ERROR:",
      error.response?.data || error
    );

    alert(
      error.response?.data?.message ||
        "Failed to create AI call"
    );
  }
};

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            AI Calls
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage AI-powered candidate screening calls.
          </p>
        </div>

        <button
          onClick={startCall}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <PhoneCall size={18} />

          Start AI Call
        </button>

      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Calls"
          value="0"
          icon={PhoneCall}
        />

        <StatCard
          title="Completed"
          value="0"
          icon={CheckCircle}
        />

        <StatCard
          title="Failed"
          value="0"
          icon={XCircle}
        />

        <StatCard
          title="Scheduled"
          value="0"
          icon={Clock}
        />

      </div>

      {/* Configuration */}

      <div className="grid gap-6 xl:grid-cols-3">

        {/* Candidates */}

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

          <div className="border-b border-slate-200 p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="font-semibold text-slate-900">
                  Select Candidates
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Select candidates for AI screening.
                </p>
              </div>

              <div className="relative w-full sm:w-72">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search candidates..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

              </div>

            </div>

          </div>

          <div className="max-h-[500px] overflow-y-auto">

            {loading ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Loading candidates...
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                No candidates found.
              </div>
            ) : (
              filteredCandidates.map((candidate) => {

                const selected =
                  selectedCandidates.includes(candidate._id);

                return (
                  <div
                    key={candidate._id}
                    className={`flex items-center gap-4 border-b border-slate-100 p-4 transition ${
                      selected
                        ? "bg-indigo-50"
                        : "hover:bg-slate-50"
                    }`}
                  >

                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        toggleCandidate(candidate._id)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                    />

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 font-semibold text-indigo-700">
                      {candidate.firstName?.[0]}
                      {candidate.lastName?.[0]}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold text-slate-800">
                        {candidate.firstName}{" "}
                        {candidate.lastName}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {candidate.currentPosition || "Candidate"}
                      </p>

                    </div>

                    <div className="hidden text-right sm:block">

                      <p className="text-xs text-slate-500">
                        {candidate.phone || "No phone"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {candidate.stage || "New"}
                      </p>

                    </div>

                  </div>
                );
              })
            )}

          </div>

        </section>

        {/* Call Configuration */}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="font-semibold text-slate-900">
            Call Configuration
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Configure how the AI assistant should call candidates.
          </p>

          {/* Mode */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Call Mode
            </label>

            <div className="grid grid-cols-2 gap-2">

              <button
                onClick={() => setCallMode("single")}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium ${
                  callMode === "single"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Single Call
              </button>

              <button
                onClick={() => setCallMode("bulk")}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium ${
                  callMode === "bulk"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                Bulk Calls
              </button>

            </div>

          </div>

          {/* Script */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Call Script
            </label>

            <select
              value={script.name}
              onChange={(e) =>
                setScript({
                  ...script,
                  name: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option>Initial Screening</option>
              <option>Technical Screening</option>
              <option>Interview Confirmation</option>
              <option>Pre-Interview</option>
              <option>Post-Interview</option>
              <option>Hiring Notification</option>
              <option>Onboarding</option>
            </select>

          </div>

          {/* Duration */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Call Duration
            </label>

            <select
              value={script.duration}
              onChange={(e) =>
                setScript({
                  ...script,
                  duration: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="3">3 Minutes</option>
              <option value="5">5 Minutes</option>
              <option value="10">10 Minutes</option>
              <option value="15">15 Minutes</option>
            </select>

          </div>

          {/* Attempts */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Maximum Attempts
            </label>

            <select
              value={script.maxAttempts}
              onChange={(e) =>
                setScript({
                  ...script,
                  maxAttempts: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="1">1 Attempt</option>
              <option value="2">2 Attempts</option>
              <option value="3">3 Attempts</option>
            </select>

          </div>

          {/* Selected */}

          <div className="mt-6 rounded-lg bg-slate-50 p-4">

            <p className="text-xs text-slate-500">
              Selected Candidates
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {selectedCandidates.length}
            </p>

          </div>

          {/* Start */}

          <button
            onClick={startCall}
            disabled={selectedCandidates.length === 0}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Phone size={17} />

            Start {callMode === "bulk" ? "Bulk" : "AI"} Call
          </button>

        </section>

      </div>

      {/* Call History */}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>
            <h2 className="font-semibold text-slate-900">
              Call History
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Recent AI recruitment calls.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Plus size={16} />
            New Workflow
          </button>

        </div>

        {callsLoading ? (
  <div className="p-8 text-center text-sm text-slate-500">
    Loading call history...
  </div>
) : calls.length === 0 ? (
  <div className="p-8 text-center">

    <PhoneCall
      size={32}
      className="mx-auto text-slate-300"
    />

    <p className="mt-3 text-sm font-medium text-slate-700">
      No calls yet
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Start an AI call to see call history here.
    </p>

  </div>
) : (
  <div className="divide-y divide-slate-100">

    {calls.map((call) => (
      <div
        key={call._id}
        className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
      >

        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-indigo-50 p-3">
            <PhoneCall
              size={18}
              className="text-indigo-600"
            />
          </div>

          <div>

            <p className="text-sm font-semibold text-slate-800">
              {call.candidate?.firstName}{" "}
              {call.candidate?.lastName}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {call.scriptName}
              {" • "}
              Attempt {call.attemptNumber}/
              {call.maxAttempts}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4">

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {call.status}
          </span>

          <span className="text-xs text-slate-400">
            {new Date(
              call.createdAt
            ).toLocaleString()}
          </span>

        </div>

      </div>
    ))}

  </div>
)}

      </section>

    </div>
  );
}

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

        <div className="rounded-lg bg-indigo-50 p-3">
          <Icon
            size={20}
            className="text-indigo-600"
          />
        </div>

      </div>

    </div>
  );
}

export default AICalls;