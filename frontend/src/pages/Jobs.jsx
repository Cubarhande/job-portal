import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  BriefcaseBusiness,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingJob, setEditingJob] =
    useState(null);

  const [form, setForm] = useState({
    title: "",
    jobCode: "",
    description: "",
    requiredSkills: "",
    preferredSkills: "",
    minExperience: "",
    maxExperience: "",
    location: "",
    workMode: "Hybrid",
    minSalary: "",
    maxSalary: "",
    noticePeriod: "",
    openings: 1,
    status: "Draft",
    clientName: "",
  });

  // -----------------------------
  // Load Jobs
  // -----------------------------

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response =
        await API.get("/jobs");

      setJobs(
        response.data.data || []
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // -----------------------------
  // Form Change
  // -----------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // -----------------------------
  // Reset Form
  // -----------------------------

  const resetForm = () => {
    setForm({
      title: "",
      jobCode: "",
      description: "",
      requiredSkills: "",
      preferredSkills: "",
      minExperience: "",
      maxExperience: "",
      location: "",
      workMode: "Hybrid",
      minSalary: "",
      maxSalary: "",
      noticePeriod: "",
      openings: 1,
      status: "Draft",
      clientName: "",
    });

    setEditingJob(null);
    setShowForm(false);
  };

  // -----------------------------
  // Edit Job
  // -----------------------------

  const handleEdit = (job) => {
    setEditingJob(job);

    setForm({
      title: job.title || "",
      jobCode: job.jobCode || "",
      description: job.description || "",

      requiredSkills:
        job.requiredSkills?.join(", ") || "",

      preferredSkills:
        job.preferredSkills?.join(", ") || "",

      minExperience:
        job.minExperience ?? "",

      maxExperience:
        job.maxExperience ?? "",

      location:
        job.location || "",

      workMode:
        job.workMode || "Hybrid",

      minSalary:
        job.minSalary ?? "",

      maxSalary:
        job.maxSalary ?? "",

      noticePeriod:
        job.noticePeriod ?? "",

      openings:
        job.openings ?? 1,

      status:
        job.status || "Draft",

      clientName:
        job.clientName || "",
    });

    setShowForm(true);
  };

  // -----------------------------
  // Submit Job
  // -----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Job title is required");
      return;
    }

    if (!form.jobCode.trim()) {
      alert("Job code is required");
      return;
    }

    try {
      const payload = {
        ...form,

        requiredSkills:
          form.requiredSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),

        preferredSkills:
          form.preferredSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),

        minExperience:
          Number(form.minExperience) || 0,

        maxExperience:
          Number(form.maxExperience) || 100,

        minSalary:
          Number(form.minSalary) || 0,

        maxSalary:
          Number(form.maxSalary) || 0,

        noticePeriod:
          Number(form.noticePeriod) || 90,

        openings:
          Number(form.openings) || 1,
      };

      if (editingJob) {
        await API.put(
          `/jobs/${editingJob._id}`,
          payload
        );

        alert(
          "Job updated successfully"
        );
      } else {
        await API.post(
          "/jobs",
          payload
        );

        alert(
          "Job created successfully"
        );
      }

      resetForm();

      fetchJobs();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to save job"
      );
    }
  };

  // -----------------------------
  // Delete Job
  // -----------------------------

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this job?"
      );

    if (!confirmed) return;

    try {
      await API.delete(
        `/jobs/${id}`
      );

      setJobs((previous) =>
        previous.filter(
          (job) => job._id !== id
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to delete job"
      );
    }
  };

  // -----------------------------
  // Search
  // -----------------------------

  const filteredJobs =
    jobs.filter((job) => {
      const value =
        search.toLowerCase();

      return (
        job.title
          ?.toLowerCase()
          .includes(value) ||
        job.jobCode
          ?.toLowerCase()
          .includes(value) ||
        job.clientName
          ?.toLowerCase()
          .includes(value) ||
        job.location
          ?.toLowerCase()
          .includes(value)
      );
    });

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Job Orders
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage recruitment jobs and
            candidate requirements.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={18} />

          Add Job
        </button>
      </div>

      {/* Form */}

      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {editingJob
                  ? "Edit Job"
                  : "Create New Job"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the requirements used
                for candidate matching.
              </p>
            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Basic Information */}

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Job Title *
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Senior MERN Developer"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Job Code *
                </label>

                <input
                  name="jobCode"
                  value={form.jobCode}
                  onChange={handleChange}
                  placeholder="JOB-1001"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Client
                </label>

                <input
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="Client company"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Pune"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

            </div>

            {/* Skills */}

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Required Skills
                </label>

                <input
                  name="requiredSkills"
                  value={
                    form.requiredSkills
                  }
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB, Express.js"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Separate skills with commas.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Preferred Skills
                </label>

                <input
                  name="preferredSkills"
                  value={
                    form.preferredSkills
                  }
                  onChange={handleChange}
                  placeholder="TypeScript, AWS"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

            </div>

            {/* Experience */}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Min Experience
                </label>

                <input
                  type="number"
                  name="minExperience"
                  value={
                    form.minExperience
                  }
                  onChange={handleChange}
                  placeholder="3"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Max Experience
                </label>

                <input
                  type="number"
                  name="maxExperience"
                  value={
                    form.maxExperience
                  }
                  onChange={handleChange}
                  placeholder="7"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notice Period
                </label>

                <input
                  type="number"
                  name="noticePeriod"
                  value={
                    form.noticePeriod
                  }
                  onChange={handleChange}
                  placeholder="30"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Openings
                </label>

                <input
                  type="number"
                  min="1"
                  name="openings"
                  value={form.openings}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

            </div>

            {/* Salary / Mode / Status */}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Min Salary
                </label>

                <input
                  type="number"
                  name="minSalary"
                  value={form.minSalary}
                  onChange={handleChange}
                  placeholder="600000"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Max Salary
                </label>

                <input
                  type="number"
                  name="maxSalary"
                  value={form.maxSalary}
                  onChange={handleChange}
                  placeholder="1500000"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Work Mode
                </label>

                <select
                  name="workMode"
                  value={form.workMode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="On-site">
                    On-site
                  </option>

                  <option value="Hybrid">
                    Hybrid
                  </option>

                  <option value="Remote">
                    Remote
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="Draft">
                    Draft
                  </option>

                  <option value="Open">
                    Open
                  </option>

                  <option value="On Hold">
                    On Hold
                  </option>

                  <option value="Closed">
                    Closed
                  </option>
                </select>
              </div>

            </div>

            {/* Description */}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Job Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the job responsibilities and requirements..."
                className="w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            {/* Buttons */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                {editingJob
                  ? "Update Job"
                  : "Create Job"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* Search */}

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search jobs, clients, locations..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Job List */}

      <div className="grid gap-4">

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Loading jobs...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <BriefcaseBusiness
              size={40}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 font-medium text-slate-700">
              No jobs found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first job order.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                {/* Job Information */}

                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="text-lg font-semibold text-slate-900">
                      {job.title}
                    </h2>

                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                      {job.jobCode}
                    </span>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {job.status}
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {job.clientName ||
                      "No client specified"}
                  </p>

                  {/* Job Info */}

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">

                    <span>
                      📍 {job.location ||
                        "Any location"}
                    </span>

                    <span>
                      💼{" "}
                      {job.minExperience}–
                      {job.maxExperience} years
                    </span>

                    <span>
                      👥 {job.openings}{" "}
                      opening
                      {job.openings !== 1
                        ? "s"
                        : ""}
                    </span>

                    <span>
                      ⏱{" "}
                      {job.noticePeriod}{" "}
                      days
                    </span>

                  </div>

                  {/* Skills */}

                  <div className="mt-4 flex flex-wrap gap-2">

                    {job.requiredSkills?.map(
                      (skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                </div>

                {/* Actions */}

                <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/jobs/${job._id}/matches`
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    <Users size={17} />

                    Find Candidates
                  </button>

                  <button
                    onClick={() =>
                      handleEdit(job)
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Edit size={16} />

                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(job._id)
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />

                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Jobs;