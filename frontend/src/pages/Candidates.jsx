import { useEffect, useState } from "react";
import { Search, Plus, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  const fetchCandidates = async () => {
    try {
      const response = await API.get("/candidates");

      setCandidates(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

const filteredCandidates = candidates.filter(
  (candidate) => {
    const text = `
      ${candidate.firstName || ""}
      ${candidate.lastName || ""}
      ${candidate.email || ""}
      ${candidate.phone || ""}
      ${candidate.currentPosition || ""}
      ${candidate.currentCompany || ""}
      ${candidate.location || ""}
      ${(candidate.skills || []).join(" ")}
      ${candidate.status || ""}
    `.toLowerCase();

    return text.includes(
      search.toLowerCase().trim()
    );
  }
);
const getStatusClass = (status) => {
  switch (status) {
    case "New":
      return "bg-slate-100 text-slate-700";

    case "Screening":
      return "bg-blue-50 text-blue-700";

    case "Technical Screening":
      return "bg-purple-50 text-purple-700";

    case "Submitted":
      return "bg-yellow-50 text-yellow-700";

    case "Interview":
      return "bg-orange-50 text-orange-700";

    case "Selected":
      return "bg-green-50 text-green-700";

    case "Hired":
      return "bg-emerald-50 text-emerald-700";

    case "Onboarding":
      return "bg-cyan-50 text-cyan-700";

    case "Rejected":
      return "bg-red-50 text-red-700";

    case "On Hold":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-indigo-50 text-indigo-600";
  }
};
  return (
    <div>
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track your candidates.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/candidates/new")}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add Candidate
        </button>
      </div>

      {/* Search */}

      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate, skill, company..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading candidates...
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-slate-700">No candidates found</p>

            <p className="mt-1 text-sm text-slate-500">
              Add your first candidate to get started.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Candidate
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Position
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Experience
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Skills
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4"></th>
                </tr>
              </thead>

              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <button
  onClick={() =>
    navigate(
      `/admin/candidates/${candidate._id}`
    )
  }
  className="font-medium text-slate-900 hover:text-indigo-600"
>
  {candidate.firstName}{" "}
  {candidate.lastName}
</button>

                        <p className="text-xs text-slate-500">
                          {candidate.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">
                        {candidate.currentPosition || "—"}
                      </p>

                      <p className="text-xs text-slate-500">
                        {candidate.currentCompany || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                     <span className="text-sm text-slate-700">
  {candidate.experience
    ? `${candidate.experience} years`
    : "Not specified"}
</span>
                    </td>

                    <td className="px-6 py-4">
                     <div className="flex max-w-xs flex-wrap gap-1">
  {candidate.skills
    ?.slice(0, 3)
    .map((skill) => (
      <span
        key={skill}
        className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
      >
        {skill}
      </span>
    ))}

  {candidate.skills?.length > 3 && (
    <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
      +{candidate.skills.length - 3}
    </span>
  )}
</div>
                    </td>

                    <td className="px-6 py-4">
                     <span
  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
    candidate.status
  )}`}
>
  {candidate.status || "New"}
</span>
                    </td>

                    <td className="px-6 py-4">
                     <button
  onClick={() =>
    navigate(
      `/admin/candidates/${candidate._id}`
    )
  }
  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
  title="View candidate"
>
  <MoreVertical size={18} />
</button>
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

export default Candidates;
