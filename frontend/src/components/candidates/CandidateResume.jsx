import {
  FileText,
  Upload,
  ExternalLink,
} from "lucide-react";

function CandidateResume({
  resume,
  onUpload,
  uploading = false,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="font-semibold text-slate-900">
          Resume
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Candidate resume and documents.
        </p>
      </div>

      <div className="p-6">
        {resume ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <FileText size={22} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900">
                  {resume.originalName ||
                    "Resume.pdf"}
                </p>

                {resume.createdAt && (
                  <p className="text-xs text-slate-500">
                    Uploaded{" "}
                    {new Date(
                      resume.createdAt
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {resume.url && (
              <a
                href={resume.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink size={16} />
                View Resume
              </a>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <FileText
              className="mx-auto text-slate-400"
              size={32}
            />

            <p className="mt-3 text-sm font-medium text-slate-700">
              No resume uploaded
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Upload PDF or DOCX resume.
            </p>
          </div>
        )}

        <div className="mt-5">
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 ${
              uploading
                ? "pointer-events-none opacity-60"
                : ""
            }`}
          >
            <Upload size={17} />

            {uploading
              ? "Uploading..."
              : resume
              ? "Replace Resume"
              : "Upload Resume"}

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={onUpload}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default CandidateResume;