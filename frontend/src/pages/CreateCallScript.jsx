import { useState } from "react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Clock,
  PhoneCall,
  MessageSquare,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

const CALL_TYPES = [
  "Discovery Call",
  "AI Screening",
  "Technical Screening",
  "Interview Reminder",
  "Pre-Interview",
  "Post-Interview",
  "Hiring Call",
  "Onboarding Call",
];

const QUESTION_TYPES = [
  "General",
  "Technical",
  "Experience",
  "Salary",
  "Availability",
  "Notice Period",
  "Location",
  "Yes/No",
];

function CreateCallScript() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    callType: "AI Screening",

    introduction:
      "Hello, this is the recruitment team calling regarding a job opportunity. Is this a good time to speak with you?",

    aiInstructions:
      "Speak professionally and naturally. Ask one question at a time. Wait for the candidate's response before continuing. If the candidate asks for clarification, explain the question briefly.",

    questions: [],

    closingMessage:
      "Thank you for your time. Our recruitment team will review your responses and contact you with the next steps.",

    maxDuration: 10,

    maxAttempts: 3,

    smsAfterAttempts: true,

    smsMessage:
      "We tried contacting you regarding a recruitment opportunity. Please contact our recruitment team when convenient.",

    timezone: "Asia/Kolkata",

    startTime: "09:00",

    endTime: "18:00",

    respectDND: true,

    respectHolidays: true,

    active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add question
  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          type: "General",
          required: true,
          order: prev.questions.length + 1,
        },
      ],
    }));
  };

  // Update question
  const updateQuestion = (index, field, value) => {
    setForm((prev) => {
      const questions = [...prev.questions];

      questions[index] = {
        ...questions[index],
        [field]: value,
      };

      return {
        ...prev,
        questions,
      };
    });
  };

  // Delete question
  const removeQuestion = (index) => {
    setForm((prev) => {
      const questions = prev.questions
        .filter((_, i) => i !== index)
        .map((question, index) => ({
          ...question,
          order: index + 1,
        }));

      return {
        ...prev,
        questions,
      };
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter a script name.");
      return;
    }

    if (!form.introduction.trim()) {
      alert("Please enter an introduction.");
      return;
    }

    const invalidQuestion = form.questions.find(
      (question) => !question.question.trim(),
    );

    if (invalidQuestion) {
      alert("Please complete all screening questions.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        maxDuration: Number(form.maxDuration),
        maxAttempts: Number(form.maxAttempts),
        questions: form.questions.map((question, index) => ({
          ...question,
          order: index + 1,
        })),
      };

      const response = await API.post("/call-scripts", payload);

      if (response.data.success) {
        navigate("/admin/call-scripts");
      }
    } catch (error) {
      console.error("CREATE CALL SCRIPT ERROR:", error.response?.data || error);

      alert(error.response?.data?.message || "Failed to create call script.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => navigate("/admin/call-scripts")}
          className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Create Call Script
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Configure an AI recruitment conversation.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ================= BASIC INFORMATION ================= */}

        <section className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2">
                <PhoneCall size={19} className="text-indigo-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Basic Information
                </h2>

                <p className="text-xs text-slate-500">
                  Define the purpose of this AI call.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <Input
              label="Script Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="React Developer AI Screening"
              required
            />

            <Select
              label="Call Type"
              name="callType"
              value={form.callType}
              onChange={handleChange}
              options={CALL_TYPES}
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe when this script should be used..."
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </section>

        {/* ================= AI CONVERSATION ================= */}

        <section className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900">AI Conversation</h2>

            <p className="mt-1 text-xs text-slate-500">
              Define how the AI should communicate with candidates.
            </p>
          </div>

          <div className="space-y-5 p-6">
            <TextArea
              label="Introduction"
              name="introduction"
              value={form.introduction}
              onChange={handleChange}
              rows={4}
              required
            />

            <TextArea
              label="AI Instructions"
              name="aiInstructions"
              value={form.aiInstructions}
              onChange={handleChange}
              rows={5}
              placeholder="Tell the AI how to conduct the conversation..."
            />
          </div>
        </section>

        {/* ================= QUESTIONS ================= */}

        <section className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Screening Questions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Add questions the AI should ask the candidate.
              </p>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus size={17} />
              Add Question
            </button>
          </div>

          <div className="space-y-4 p-6">
            {form.questions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                <MessageSquare size={30} className="mx-auto text-slate-400" />

                <p className="mt-3 text-sm font-medium text-slate-700">
                  No questions added
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Add screening questions for the AI.
                </p>
              </div>
            ) : (
              form.questions.map((question, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Question {index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Question
                      </label>

                      <textarea
                        value={question.question}
                        onChange={(e) =>
                          updateQuestion(index, "question", e.target.value)
                        }
                        rows={3}
                        placeholder="e.g. How many years of React experience do you have?"
                        className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    <Select
                      label="Question Type"
                      value={question.type}
                      onChange={(e) =>
                        updateQuestion(index, "type", e.target.value)
                      }
                      options={QUESTION_TYPES}
                    />

                    <div className="flex items-end">
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                        <input
                          type="checkbox"
                          checked={question.required}
                          onChange={(e) =>
                            updateQuestion(index, "required", e.target.checked)
                          }
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                        />

                        <span className="text-sm font-medium text-slate-700">
                          Required question
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ================= CLOSING ================= */}

        <section className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900">Closing Message</h2>
          </div>

          <div className="p-6">
            <TextArea
              label="Closing Message"
              name="closingMessage"
              value={form.closingMessage}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </section>

        {/* ================= CALL SETTINGS ================= */}

        <section className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-indigo-600" />

              <div>
                <h2 className="font-semibold text-slate-900">Call Settings</h2>

                <p className="mt-1 text-xs text-slate-500">
                  Configure duration, retries and calling hours.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Maximum Duration (Minutes)"
              name="maxDuration"
              type="number"
              min="1"
              max="60"
              value={form.maxDuration}
              onChange={handleChange}
            />

            <Input
              label="Maximum Attempts"
              name="maxAttempts"
              type="number"
              min="1"
              max="5"
              value={form.maxAttempts}
              onChange={handleChange}
            />

            <Select
              label="Timezone"
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              options={[
                "Asia/Kolkata",
                "America/New_York",
                "America/Chicago",
                "America/Denver",
                "America/Los_Angeles",
                "Europe/London",
                "Asia/Singapore",
              ]}
            />

            <Input
              label="Calling Start Time"
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleChange}
            />

            <Input
              label="Calling End Time"
              name="endTime"
              type="time"
              value={form.endTime}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* ================= RETRY / SMS ================= */}

        <section className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900">
              Callback & SMS Rules
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Control repeated calls and candidate notifications.
            </p>
          </div>

          <div className="space-y-5 p-6">
            <Checkbox
              name="smsAfterAttempts"
              checked={form.smsAfterAttempts}
              onChange={handleChange}
              label="Send SMS after maximum call attempts"
            />

            {form.smsAfterAttempts && (
              <TextArea
                label="SMS Message"
                name="smsMessage"
                value={form.smsMessage}
                onChange={handleChange}
                rows={4}
              />
            )}
          </div>
        </section>

        {/* ================= DND / HOLIDAYS ================= */}

        <section className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900">
              Calling Restrictions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Prevent inappropriate calls.
            </p>
          </div>

          <div className="space-y-4 p-6">
            <Checkbox
              name="respectDND"
              checked={form.respectDND}
              onChange={handleChange}
              label="Respect candidate Do Not Disturb settings"
            />

            <Checkbox
              name="respectHolidays"
              checked={form.respectHolidays}
              onChange={handleChange}
              label="Do not call on configured holidays"
            />
          </div>
        </section>

        {/* ================= ACTIVE ================= */}

        <section className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6">
            <Checkbox
              name="active"
              checked={form.active}
              onChange={handleChange}
              label="Make this call script active"
            />
          </div>
        </section>

        {/* ================= ACTIONS ================= */}

        <div className="mb-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/call-scripts")}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {loading ? "Saving..." : "Save Call Script"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  min,
  max,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({ name, checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />

      <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
  );
}

export default CreateCallScript;
