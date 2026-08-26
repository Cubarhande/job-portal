import { useEffect, useState } from "react";
import {
  Plus,
  PhoneCall,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import API from "../services/api";
import { useNavigate } from "react-router-dom";

function CallScripts() {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  const fetchScripts = async () => {
    try {
      setLoading(true);

      const response =
        await API.get("/call-scripts");

      setScripts(response.data.data || []);
    } catch (error) {
      console.error(
        "GET CALL SCRIPTS ERROR:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  const toggleScript = async (id) => {
    try {
      await API.patch(
        `/call-scripts/${id}/toggle`
      );

      fetchScripts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Call Scripts
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage AI recruitment call scripts.
          </p>
        </div>

<button
  onClick={() =>
    navigate("/admin/call-scripts/new")
  }
  className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
>
          <Plus size={18} />
          Create Script
        </button>
      </div>

      {/* Content */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading call scripts...
          </div>
        ) : scripts.length === 0 ? (
          <div className="p-10 text-center">
            <PhoneCall
              size={35}
              className="mx-auto text-slate-400"
            />

            <p className="mt-3 font-medium text-slate-700">
              No call scripts
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first AI recruitment script.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {scripts.map((script) => (
              <div
                key={script._id}
                className="flex flex-col gap-4 p-5 hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                    <PhoneCall
                      size={20}
                      className="text-indigo-600"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {script.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {script.description ||
                        "AI recruitment call script"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                        {script.callType}
                      </span>

                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        <Clock size={12} />
                        {script.maxDuration} min
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        {script.questions?.length || 0} questions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      toggleScript(script._id)
                    }
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                      script.active
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {script.active ? (
                      <CheckCircle size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}

                    {script.active
                      ? "Active"
                      : "Inactive"}
                  </button>

                  <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CallScripts;