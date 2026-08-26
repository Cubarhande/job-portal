import {
  CheckCircle2,
  FileText,
  Phone,
  Calendar,
  UserPlus,
  ArrowRight,
} from "lucide-react";

const getActivityIcon = (type) => {
  switch (type) {
    case "Stage Change":
      return ArrowRight;

    case "Resume Upload":
      return FileText;

    case "AI Call":
      return Phone;

    case "Interview":
      return Calendar;

    case "Candidate Created":
      return UserPlus;

    default:
      return CheckCircle2;
  }
};

function CandidateActivityTimeline({
  activities,
  loading,
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          Activity Timeline
        </h2>

        <p className="mt-4 text-sm text-slate-500">
          Loading activities...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="font-semibold text-slate-900">
          Activity Timeline
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Complete candidate recruitment history.
        </p>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-500">
              No activity yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity) => {
              const Icon =
                getActivityIcon(
                  activity.type
                );

              return (
                <div
                  key={activity._id}
                  className="relative flex gap-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-sm font-medium text-slate-900">
                        {activity.title}
                      </h3>

                      <span className="text-xs text-slate-400">
                        {new Date(
                          activity.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>

                    {activity.description && (
                      <p className="mt-1 text-sm text-slate-500">
                        {activity.description}
                      </p>
                    )}

                    {activity.job && (
                      <p className="mt-2 text-xs text-indigo-600">
                        Job:{" "}
                        {activity.job.title}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateActivityTimeline;