import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Search,
  Upload,
  Download,
  Eye,
  Trash2,
  X,
} from "lucide-react";

import API from "../services/api";

function Documents() {
  const [documents, setDocuments] = useState([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [showUpload, setShowUpload] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "Resume",
    candidate: "",
    description: "",
    file: null,
  });

  // ========================================
  // FETCH DOCUMENTS
  // ========================================

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const response = await API.get("/documents");

      setDocuments(response.data.data || []);
    } catch (error) {
      console.error("FETCH DOCUMENTS ERROR:", error.response?.data || error);

      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // ========================================
  // FILTER
  // ========================================

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const text = `
        ${doc.name || ""}
        ${doc.type || ""}
        ${doc.originalName || ""}
        ${doc.candidate?.firstName || ""}
        ${doc.candidate?.lastName || ""}
      `.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesType = typeFilter === "All" || doc.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [documents, search, typeFilter]);

  // ========================================
  // UPLOAD
  // ========================================

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!form.file) {
      alert("Please select a file.");
      return;
    }

    try {
      setUploading(true);

      const data = new FormData();

      data.append("file", form.file);
      data.append("name", form.name);
      data.append("type", form.type);
      data.append("description", form.description);

      if (form.candidate.trim()) {
        data.append("candidate", form.candidate.trim());
      }

      const response = await API.post("/documents", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Document uploaded successfully.");

        setForm({
          name: "",
          type: "Resume",
          candidate: "",
          description: "",
          file: null,
        });

        setShowUpload(false);

        await fetchDocuments();
      }
    } catch (error) {
      console.error("UPLOAD DOCUMENT ERROR:", error.response?.data || error);

      alert(error.response?.data?.message || "Document upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // ========================================
  // DELETE
  // ========================================

  const deleteDocument = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirmed) return;

    try {
      const response = await API.delete(`/documents/${id}`);

      if (response.data.success) {
        await fetchDocuments();
      }
    } catch (error) {
      console.error("DELETE DOCUMENT ERROR:", error.response?.data || error);

      alert(error.response?.data?.message || "Failed to delete document.");
    }
  };

  // ========================================
  // RESET FORM
  // ========================================

  const closeUploadModal = () => {
    if (uploading) return;

    setShowUpload(false);

    setForm({
      name: "",
      type: "Resume",
      candidate: "",
      description: "",
      file: null,
    });
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documents</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage resumes, contracts and recruitment documents.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Upload size={18} />
          Upload Document
        </button>
      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DocumentStat title="Total Documents" value={documents.length} />

        <DocumentStat
          title="Resumes"
          value={documents.filter((doc) => doc.type === "Resume").length}
        />

        <DocumentStat
          title="Contracts"
          value={documents.filter((doc) => doc.type === "Contract").length}
        />

        <DocumentStat
          title="Other"
          value={
            documents.filter(
              (doc) => !["Resume", "Contract"].includes(doc.type),
            ).length
          }
        />
      </div>

      {/* FILTER */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_200px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          >
            <option value="All">All</option>

            <option value="Resume">Resume</option>

            <option value="Contract">Contract</option>

            <option value="Offer Letter">Offer Letter</option>

            <option value="Certificate">Certificate</option>

            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* DOCUMENT LIST */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading documents...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-10 text-center">
            <FileText size={42} className="mx-auto text-slate-300" />

            <p className="mt-4 font-medium text-slate-700">
              No documents found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Upload your first recruitment document.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDocuments.map((doc) => (
              <div
                key={doc._id}
                className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <FileText size={21} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {doc.name || doc.originalName || "Document"}
                    </h3>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>{doc.type || "Other"}</span>

                      <span>
                        {doc.fileSize
                          ? `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB`
                          : "—"}
                      </span>

                      <span>
                        {doc.createdAt
                          ? new Date(doc.createdAt).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {doc.url && (
                    <>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        title="View"
                      >
                        <Eye size={17} />
                      </a>

                      <a
                        href={doc.url}
                        download
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        title="Download"
                      >
                        <Download size={17} />
                      </a>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteDocument(doc._id)}
                    className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UPLOAD MODAL */}

      {showUpload && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Upload Document
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add a new recruitment document.
                </p>
              </div>

              <button
                type="button"
                onClick={closeUploadModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleUpload} className="space-y-5 p-5">
              {/* NAME */}

              <div>
                <label className="label">Document Name</label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Candidate Resume"
                  className="input"
                  required
                />
              </div>

              {/* TYPE */}

              <div>
                <label className="label">Document Type</label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }
                  className="input"
                >
                  <option value="Resume">Resume</option>

                  <option value="Contract">Contract</option>

                  <option value="Offer Letter">Offer Letter</option>

                  <option value="Certificate">Certificate</option>

                  <option value="Other">Other</option>
                </select>
              </div>

              {/* CANDIDATE */}

              <div>
                <label className="label">Candidate ID</label>

                <input
                  value={form.candidate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      candidate: e.target.value,
                    })
                  }
                  placeholder="Optional candidate ID"
                  className="input"
                />
              </div>

              {/* FILE */}

              <div>
                <label className="label">File</label>

                <input
                  type="file"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      file: e.target.files?.[0] || null,
                    })
                  }
                  className="block w-full rounded-lg border border-slate-200 p-2 text-sm"
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="label">Description</label>

                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  className="input resize-none"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload Document"}
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
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
          background: white;
        }

        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgb(99 102 241 / 10%);
        }
      `}</style>
    </div>
  );
}

// ========================================
// STAT
// ========================================

function DocumentStat({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default Documents;
