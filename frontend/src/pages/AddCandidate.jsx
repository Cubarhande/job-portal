import { useState } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddCandidate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    currentCompany: "",
    currentPosition: "",
    expectedSalary: "",
    noticePeriod: "",
    skills: [],
    status: "New",
  stage: "New",
  });

  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (!form.skills.includes(skill)) {
      setForm({
        ...form,
        skills: [...form.skills, skill],
      });
    }

    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setForm({
      ...form,
      skills: form.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/candidates", {
        ...form,
        experience: Number(form.experience),
        expectedSalary: Number(form.expectedSalary),
        noticePeriod: Number(form.noticePeriod),
      });

      navigate("/admin/candidates");
    } catch (error) {
       console.error(
    "ADD CANDIDATE ERROR:",
    error.response?.data
  );

      alert(
        error.response?.data?.message ||
          "Failed to create candidate"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}

      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/candidates")}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Add Candidate
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create a new candidate profile.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Basic candidate information.
            </p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <Input
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />

            <Input
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <Input
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Pune, India"
            />
          </div>
        </div>

        {/* Professional Information */}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">
              Professional Information
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Candidate's current employment and experience.
            </p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <Input
              label="Current Position"
              name="currentPosition"
              value={form.currentPosition}
              onChange={handleChange}
              placeholder="Senior React Developer"
            />

            <Input
              label="Current Company"
              name="currentCompany"
              value={form.currentCompany}
              onChange={handleChange}
              placeholder="ABC Technologies"
            />

            <Input
              label="Experience (Years)"
              name="experience"
              type="number"
              min="0"
              value={form.experience}
              onChange={handleChange}
            />

            <Input
              label="Expected Salary"
              name="expectedSalary"
              type="number"
              min="0"
              value={form.expectedSalary}
              onChange={handleChange}
              placeholder="120000"
            />

            <Input
              label="Notice Period (Days)"
              name="noticePeriod"
              type="number"
              min="0"
              value={form.noticePeriod}
              onChange={handleChange}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Candidate Status
              </label>

             <select
  name="status"
  value={form.status}
  onChange={handleChange}
  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
>
  <option value="New">New</option>
</select>
            </div>
          </div>
        </div>

        {/* Skills */}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">
              Skills
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Add candidate technical and professional skills.
            </p>
          </div>

          <div className="p-6">
            <div className="flex gap-3">
              <input
                value={skillInput}
                onChange={(e) =>
                  setSkillInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Enter skill e.g. React"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={addSkill}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Add
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                >
                  {skill}

                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/candidates")
            }
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {loading
              ? "Saving..."
              : "Save Candidate"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}

export default AddCandidate;