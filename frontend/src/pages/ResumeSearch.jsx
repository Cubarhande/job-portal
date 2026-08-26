import {
  Search,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  Clock,
} from "lucide-react";

import { useState } from "react";

import API from "../services/api";

function ResumeSearch() {
  const [keyword, setKeyword] = useState("");

  const [location, setLocation] = useState("");

  const [minExperience, setMinExperience] = useState("");

  const [maxExperience, setMaxExperience] = useState("");

  const [noticePeriod, setNoticePeriod] = useState("");

  const [status, setStatus] = useState("");

  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(false);

  const searchCandidates = async () => {
    try {
      setLoading(true);

      const params = {
        keyword,
        location,
        minExperience,
        maxExperience,
        noticePeriod,
        status,
      };

      const response = await API.get("/resume-search", {
        params,
      });

      setCandidates(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Resume Search
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Search and filter candidates based on recruitment requirements.
        </p>
      </div>

      {/* Search */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Keyword */}

          <div className="relative lg:col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search skills, job title, company..."
              className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Location */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Location
            </label>

            <div className="relative">
              <MapPin
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Pune"
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Experience */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Experience
            </label>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
              />

              <input
                type="number"
                placeholder="Max"
                value={maxExperience}
                onChange={(e) => setMaxExperience(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Notice */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Maximum Notice Period
            </label>

            <div className="relative">
              <Clock
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="number"
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                placeholder="30 days"
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Status */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Candidate Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">All Statuses</option>

              <option value="New">New</option>

              <option value="Screening">Screening</option>

              <option value="Technical">Technical</option>

              <option value="Submitted">Submitted</option>

              <option value="Interview">Interview</option>

              <option value="Selected">Selected</option>

              <option value="Hired">Hired</option>
            </select>
          </div>
        </div>

        {/* Search Button */}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={() => {
              setKeyword("");
              setLocation("");
              setMinExperience("");
              setMaxExperience("");
              setNoticePeriod("");
              setStatus("");
              setCandidates([]);
            }}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>

          <button
            onClick={searchCandidates}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Search size={17} />
            Search Candidates
          </button>
        </div>
      </div>

      {/* Results */}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <h2 className="font-semibold text-slate-900">Search Results</h2>

          <p className="mt-1 text-sm text-slate-500">
            {candidates.length} candidates found
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Searching candidates...
          </div>
        ) : candidates.length === 0 ? (
          <div className="p-10 text-center">
            <Search size={36} className="mx-auto text-slate-300" />

            <p className="mt-3 font-medium text-slate-700">
              No candidates found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search filters.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                    Candidate
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                    Skills
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                    Experience
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                    Location
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                    Notice
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {candidates.map((candidate) => (
                  <tr
                    key={candidate._id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {candidate.firstName} {candidate.lastName}
                      </p>

                      <p className="text-xs text-slate-500">
                        {candidate.currentPosition}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex max-w-xs flex-wrap gap-1">
                        {candidate.skills?.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {candidate.experience} years
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {candidate.location}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {candidate.noticePeriod} days
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {candidate.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeSearch;
