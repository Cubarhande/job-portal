import { Search, MapPin, Briefcase, CheckCircle } from "lucide-react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../services/api";

function JobMatches() {
  const { jobId } = useParams();

  const [results, setResults] = useState([]);

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const response = await API.get(`/job-matches/${jobId}`);

        setResults(response.data.data);

        setJob(response.data.job);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [jobId]);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Finding matching candidates...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <p className="text-sm font-medium text-indigo-600">Job Matching</p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          {job?.title}
        </h1>

        <p className="mt-1 text-sm text-slate-500">{job?.jobCode}</p>
      </div>

      {/* Results */}

      <div className="grid gap-4">
        {results.map((item) => {
          const candidate = item.candidate;

          return (
            <div
              key={candidate._id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Candidate */}

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                    {candidate.firstName?.[0]}
                    {candidate.lastName?.[0]}
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {candidate.firstName} {candidate.lastName}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {candidate.currentPosition}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} />
                        {candidate.experience} years
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin size={14} />

                        {candidate.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score */}

                <div className="text-left lg:text-right">
                  <p className="text-xs font-medium uppercase text-slate-400">
                    Match Score
                  </p>

                  <p className="mt-1 text-3xl font-bold text-indigo-600">
                    {item.score}%
                  </p>
                </div>
              </div>

              {/* Skills */}

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                  Matched Skills
                </p>

                <div className="flex flex-wrap gap-2">
                  {item.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reasons */}

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                  Why this candidate matched
                </p>

                <div className="grid gap-2 sm:grid-cols-2">
                  {item.reasons.map((reason, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <CheckCircle
                        size={16}
                        className="mt-0.5 shrink-0 text-emerald-500"
                      />

                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}

              <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  View Resume
                </button>

                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  Start Screening
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default JobMatches;
