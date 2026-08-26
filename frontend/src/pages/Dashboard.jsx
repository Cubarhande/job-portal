import { useEffect, useMemo, useState } from "react";
import {
  Users,
  PhoneCall,
  BriefcaseBusiness,
  CalendarDays,
  Loader2,
  RefreshCw,
} from "lucide-react";

import API from "../services/api";

function Dashboard() {
  // ========================================
  // STATE
  // ========================================

  const [candidates, setCandidates] = useState([]);
  const [aiCalls, setAiCalls] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ========================================
  // LOAD DASHBOARD DATA
  // ========================================

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const results = await Promise.allSettled([
        API.get("/candidates"),
        API.get("/ai-calls"),
        API.get("/jobs"),
        API.get("/interviews"),
      ]);

      // Candidates
      if (results[0].status === "fulfilled") {
        setCandidates(results[0].value.data?.data || []);
      } else {
        console.error(
          "CANDIDATES ERROR:",
          results[0].reason?.response?.data || results[0].reason
        );
        setCandidates([]);
      }

      // AI Calls
      if (results[1].status === "fulfilled") {
        setAiCalls(results[1].value.data?.data || []);
      } else {
        console.error(
          "AI CALLS ERROR:",
          results[1].reason?.response?.data || results[1].reason
        );
        setAiCalls([]);
      }

      // Jobs
      if (results[2].status === "fulfilled") {
        setJobs(results[2].value.data?.data || []);
      } else {
        console.error(
          "JOBS ERROR:",
          results[2].reason?.response?.data || results[2].reason
        );
        setJobs([]);
      }

      // Interviews
      if (results[3].status === "fulfilled") {
        setInterviews(results[3].value.data?.data || []);
      } else {
        console.error(
          "INTERVIEWS ERROR:",
          results[3].reason?.response?.data || results[3].reason
        );
        setInterviews([]);
      }
    } catch (error) {
      console.error(
        "DASHBOARD ERROR:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ========================================
  // TODAY
  // ========================================

  const today = useMemo(() => {
    const date = new Date();

    return {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  }, []);

  // ========================================
  // INTERVIEWS TODAY
  // ========================================

  const interviewsToday = useMemo(() => {
    return interviews.filter((interview) => {
      if (!interview.scheduledAt) return false;

      const date = new Date(interview.scheduledAt);

      return (
        date.getDate() === today.day &&
        date.getMonth() === today.month &&
        date.getFullYear() === today.year
      );
    });
  }, [interviews, today]);

  // ========================================
  // AI CALLS TODAY
  // ========================================

  const aiCallsToday = useMemo(() => {
    return aiCalls.filter((call) => {
      const callDate =
        call.createdAt ||
        call.startedAt ||
        call.date;

      if (!callDate) return false;

      const date = new Date(callDate);

      return (
        date.getDate() === today.day &&
        date.getMonth() === today.month &&
        date.getFullYear() === today.year
      );
    });
  }, [aiCalls, today]);

  // ========================================
  // OPEN JOBS
  // ========================================

  const openJobs = useMemo(() => {
    return jobs.filter((job) => {
      const status = String(job.status || "").toLowerCase();

      return (
        status === "open" ||
        status === "active"
      );
    });
  }, [jobs]);

  // ========================================
  // DASHBOARD STATS
  // ========================================

  const stats = [
    {
      title: "Total Candidates",
      value: candidates.length,
      change: "Live",
      icon: Users,
    },
    {
      title: "AI Calls Today",
      value: aiCallsToday.length,
      change: "Today",
      icon: PhoneCall,
    },
    {
      title: "Open Jobs",
      value: openJobs.length,
      change: "Active",
      icon: BriefcaseBusiness,
    },
    {
      title: "Interviews Today",
      value: interviewsToday.length,
      change: "Today",
      icon: CalendarDays,
    },
  ];

  // ========================================
  // CANDIDATE PIPELINE
  // ========================================

  const pipelineStages = [
    "New",
    "Screening",
    "Submitted",
    "Interview",
    "Selected",
    "Hired",
  ];

  const pipeline = pipelineStages.map((stage) => {
    const count = candidates.filter(
      (candidate) =>
        String(candidate.stage || "").toLowerCase() ===
        stage.toLowerCase()
    ).length;

    return {
      name: stage,
      value: count,
    };
  });

  // ========================================
  // RECENT AI CALLS
  // ========================================

  const recentAICalls = [...aiCalls]
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt ||
          a.startedAt ||
          a.date ||
          0
      );

      const dateB = new Date(
        b.createdAt ||
          b.startedAt ||
          b.date ||
          0
      );

      return dateB - dateA;
    })
    .slice(0, 5);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={34}
            className="mx-auto animate-spin text-indigo-600"
          />

          <p className="mt-4 text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="space-y-6">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your recruitment activities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={
              refreshing ? "animate-spin" : ""
            }
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ========================================
          STATS
      ======================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-indigo-50 p-3">
                  <Icon
                    size={22}
                    className="text-indigo-600"
                  />
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                  {stat.change}
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                {stat.title}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {stat.value.toLocaleString()}
              </h2>
            </div>
          );
        })}
      </div>

      {/* ========================================
          PIPELINE + AI CALLS
      ======================================== */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* ========================================
            CANDIDATE PIPELINE
        ======================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Candidate Pipeline
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current candidate distribution
              </p>
            </div>

            <Users
              size={20}
              className="text-indigo-600"
            />
          </div>

          <div className="mt-6 space-y-4">
            {pipeline.map((item) => {
              const percentage =
                candidates.length > 0
                  ? Math.round(
                      (item.value /
                        candidates.length) *
                        100
                    )
                  : 0;

              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      {item.name}
                    </span>

                    <span className="font-semibold text-slate-900">
                      {item.value}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {candidates.length === 0 && (
              <div className="rounded-lg bg-slate-50 p-6 text-center">
                <p className="text-sm text-slate-500">
                  No candidates available.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ========================================
            RECENT AI CALLS
        ======================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent AI Calls
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest candidate call activity
              </p>
            </div>

            <PhoneCall
              size={20}
              className="text-indigo-600"
            />
          </div>

          <div className="mt-6 space-y-4">
            {recentAICalls.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-6 text-center">
                <PhoneCall
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm text-slate-500">
                  No AI calls available.
                </p>
              </div>
            ) : (
              recentAICalls.map((call) => {
                const candidate =
                  call.candidate;

                const candidateName =
                  typeof candidate === "object"
                    ? `${candidate.firstName || ""} ${
                        candidate.lastName || ""
                      }`.trim()
                    : call.candidateName ||
                      call.name ||
                      "Candidate";

                const status =
                  call.status || "Unknown";

                const score =
                  call.score ??
                  call.aiScore ??
                  call.matchScore;

                return (
                  <div
                    key={call._id}
                    className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {candidateName || "Candidate"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {status}
                      </p>
                    </div>

                    <span className="ml-4 text-sm font-semibold text-indigo-600">
                      {score !== undefined &&
                      score !== null
                        ? `${score}%`
                        : "—"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ========================================
          RECENT INTERVIEWS + JOBS
      ======================================== */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* ========================================
            TODAY'S INTERVIEWS
        ======================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Today's Interviews
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Scheduled candidate interviews
              </p>
            </div>

            <CalendarDays
              size={20}
              className="text-indigo-600"
            />
          </div>

          <div className="mt-6 space-y-4">
            {interviewsToday.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-6 text-center">
                <CalendarDays
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm text-slate-500">
                  No interviews scheduled today.
                </p>
              </div>
            ) : (
              interviewsToday
                .slice(0, 5)
                .map((interview) => {
                  const candidate =
                    interview.candidate;

                  const candidateName =
                    typeof candidate ===
                    "object"
                      ? `${candidate.firstName || ""} ${
                          candidate.lastName || ""
                        }`.trim()
                      : "Candidate";

                  return (
                    <div
                      key={interview._id}
                      className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {candidateName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {interview.scheduledAt
                            ? new Date(
                                interview.scheduledAt
                              ).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute:
                                    "2-digit",
                                }
                              )
                            : "—"}

                          {" • "}

                          {interview.type ||
                            "Interview"}
                        </p>
                      </div>

                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                        {interview.status ||
                          "Scheduled"}
                      </span>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* ========================================
            OPEN JOBS
        ======================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Open Jobs
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Currently active recruitment positions
              </p>
            </div>

            <BriefcaseBusiness
              size={20}
              className="text-indigo-600"
            />
          </div>

          <div className="mt-6 space-y-4">
            {openJobs.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-6 text-center">
                <BriefcaseBusiness
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm text-slate-500">
                  No open jobs available.
                </p>
              </div>
            ) : (
              openJobs
                .slice(0, 5)
                .map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {job.title ||
                          job.name ||
                          "Untitled Job"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {job.company ||
                          job.department ||
                          "Recruitment"}
                      </p>
                    </div>

                    <span className="ml-4 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                      {job.status || "Open"}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;