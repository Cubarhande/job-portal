import { Check, Circle } from "lucide-react";

const stages = [
  "New",
  "Discovery Call",
  "AI Screening",
  "Technical Test",
  "Technical Screening",
  "Submitted",
  "Interview Scheduled",
  "Pre-Interview",
  "Interview",
  "Post-Interview",
  "Selected",
  "Hiring",
  "Onboarding",
];

function CandidatePipeline({ currentStage, onStageChange, updating = false }) {
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="font-semibold text-slate-900">Recruitment Pipeline</h2>

        <p className="mt-1 text-xs text-slate-500">
          Track the candidate's recruitment progress.
        </p>
      </div>

      <div className="overflow-x-auto p-6">
        <div className="flex min-w-max items-center">
          {stages.map((stage, index) => {
            const completed = index < currentIndex;

            const active = stage === currentStage;

            return (
              <div key={stage} className="flex items-center">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => onStageChange(stage)}
                  className="group flex flex-col items-center"
                >
                  <div
                    className={`
                      flex h-10 w-10 items-center
                      justify-center rounded-full
                      border-2 transition
                      ${
                        active
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : completed
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-slate-300 bg-white text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500"
                      }
                    `}
                  >
                    {completed ? <Check size={18} /> : <Circle size={14} />}
                  </div>

                  <span
                    className={`
                      mt-2 max-w-[100px]
                      text-center text-xs
                      ${
                        active
                          ? "font-semibold text-indigo-600"
                          : "text-slate-500"
                      }
                    `}
                  >
                    {stage}
                  </span>
                </button>

                {index < stages.length - 1 && (
                  <div
                    className={`
                      mx-2 h-0.5 w-8
                      ${index < currentIndex ? "bg-green-500" : "bg-slate-200"}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {updating && (
        <div className="border-t border-slate-200 px-6 py-3 text-xs text-slate-500">
          Updating candidate stage...
        </div>
      )}
    </div>
  );
}

export default CandidatePipeline;
