import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserX,
  BriefcaseBusiness,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Trash2,
  X,
  Eye,
} from "lucide-react";

import API from "../services/api";

function Employees() {
  const [employees, setEmployees] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    company: "",
    location: "",
    joiningDate: "",
    salary: "",
    status: "Active",
  };

  const [form, setForm] = useState(emptyForm);

  // ========================================
  // FETCH EMPLOYEES
  // ========================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await API.get("/employees");

      setEmployees(response.data.data || []);
    } catch (error) {
      console.error(
        "FETCH EMPLOYEES ERROR:",
        error.response?.data || error
      );

      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ========================================
  // FILTER EMPLOYEES
  // ========================================

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const fullText = `
        ${employee.firstName || ""}
        ${employee.lastName || ""}
        ${employee.email || ""}
        ${employee.phone || ""}
        ${employee.position || ""}
        ${employee.department || ""}
        ${employee.company || ""}
        ${employee.location || ""}
      `.toLowerCase();

      const matchesSearch = fullText.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        statusFilter === "All" ||
        employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  // ========================================
  // STATISTICS
  // ========================================

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "Inactive"
  ).length;

  const onLeaveEmployees = employees.filter(
    (employee) => employee.status === "On Leave"
  ).length;

  // ========================================
  // OPEN ADD MODAL
  // ========================================

  const openAddModal = () => {
    setEditingEmployee(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // ========================================
  // OPEN EDIT MODAL
  // ========================================

  const openEditModal = (employee) => {
    setEditingEmployee(employee);

    setForm({
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      phone: employee.phone || "",
      position: employee.position || "",
      department: employee.department || "",
      company: employee.company || "",
      location: employee.location || "",
      joiningDate: employee.joiningDate
        ? employee.joiningDate.substring(0, 10)
        : "",
      salary: employee.salary || "",
      status: employee.status || "Active",
    });

    setShowModal(true);
  };

  // ========================================
  // HANDLE FORM CHANGE
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // SAVE EMPLOYEE
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      let response;

      if (editingEmployee) {
        response = await API.put(
          `/employees/${editingEmployee._id}`,
          form
        );
      } else {
        response = await API.post(
          "/employees",
          form
        );
      }

      if (response.data.success) {
        alert(
          editingEmployee
            ? "Employee updated successfully."
            : "Employee created successfully."
        );

        setShowModal(false);

        setEditingEmployee(null);

        setForm(emptyForm);

        await fetchEmployees();
      }
    } catch (error) {
      console.error(
        "SAVE EMPLOYEE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save employee."
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // DELETE EMPLOYEE
  // ========================================

  const deleteEmployee = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/employees/${id}`);

      await fetchEmployees();

      alert("Employee deleted successfully.");
    } catch (error) {
      console.error(
        "DELETE EMPLOYEE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete employee."
      );
    }
  };

  // ========================================
  // VIEW EMPLOYEE
  // ========================================

  const openViewModal = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading employees...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Employees
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage hired employees and employee information.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* ========================================
          STATISTICS
      ======================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <EmployeeStat
          title="Total Employees"
          value={totalEmployees}
          icon={Users}
        />

        <EmployeeStat
          title="Active"
          value={activeEmployees}
          icon={UserCheck}
        />

        <EmployeeStat
          title="Inactive"
          value={inactiveEmployees}
          icon={UserX}
        />

        <EmployeeStat
          title="On Leave"
          value={onLeaveEmployees}
          icon={BriefcaseBusiness}
        />
      </div>

      {/* ========================================
          FILTERS
      ======================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_200px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search employees..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* ========================================
          EMPLOYEE LIST
      ======================================== */}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {filteredEmployees.length === 0 ? (
          <div className="p-12 text-center">
            <Users
              size={44}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-medium text-slate-700">
              No employees found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add an employee or change your search filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredEmployees.map((employee) => {
              const fullName = [
                employee.firstName,
                employee.lastName,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={employee._id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
                >
                  {/* EMPLOYEE INFO */}

                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700">
                      {employee.firstName?.[0] || "E"}
                      {employee.lastName?.[0] || ""}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="truncate text-sm font-semibold text-slate-900">
                          {fullName || "Employee"}
                        </h3>

                        <StatusBadge
                          status={
                            employee.status || "Active"
                          }
                        />
                      </div>

                      <p className="mt-1 text-sm text-slate-600">
                        {employee.position ||
                          "Employee"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                        {employee.email && (
                          <span className="flex items-center gap-1.5">
                            <Mail size={14} />
                            {employee.email}
                          </span>
                        )}

                        {employee.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone size={14} />
                            {employee.phone}
                          </span>
                        )}

                        {employee.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {employee.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* EMPLOYEE META */}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="min-w-[150px]">
                      <p className="text-xs text-slate-400">
                        Department
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {employee.department || "—"}
                      </p>
                    </div>

                    <div className="min-w-[150px]">
                      <p className="text-xs text-slate-400">
                        Company
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {employee.company || "—"}
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          openViewModal(employee)
                        }
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        title="View"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        onClick={() =>
                          openEditModal(employee)
                        }
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        title="Edit"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() =>
                          deleteEmployee(employee._id)
                        }
                        className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================
          ADD / EDIT MODAL
      ======================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="font-semibold text-slate-900">
                  {editingEmployee
                    ? "Edit Employee"
                    : "Add Employee"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingEmployee
                    ? "Update employee information."
                    : "Add a new employee to the portal."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />

                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />

                <FormField
                  label="Position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="Department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                />

                <FormField
                  label="Company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                />

                <FormField
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />

                <FormField
                  label="Joining Date"
                  name="joiningDate"
                  type="date"
                  value={form.joiningDate}
                  onChange={handleChange}
                />

                <FormField
                  label="Salary"
                  name="salary"
                  type="number"
                  value={form.salary}
                  onChange={handleChange}
                />

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                    <option value="On Leave">
                      On Leave
                    </option>
                  </select>
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingEmployee
                      ? "Update Employee"
                      : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================
          VIEW EMPLOYEE MODAL
      ======================================== */}

      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Employee Details
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Employee profile information.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowViewModal(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* PROFILE */}

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-700">
                  {selectedEmployee.firstName?.[0]}
                  {selectedEmployee.lastName?.[0]}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedEmployee.firstName}{" "}
                    {selectedEmployee.lastName}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {selectedEmployee.position ||
                      "Employee"}
                  </p>
                </div>
              </div>

              {/* DETAILS */}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={
                    selectedEmployee.email ||
                    "—"
                  }
                />

                <InfoItem
                  icon={Phone}
                  label="Phone"
                  value={
                    selectedEmployee.phone ||
                    "—"
                  }
                />

                <InfoItem
                  icon={BriefcaseBusiness}
                  label="Department"
                  value={
                    selectedEmployee.department ||
                    "—"
                  }
                />

                <InfoItem
                  icon={BriefcaseBusiness}
                  label="Company"
                  value={
                    selectedEmployee.company ||
                    "—"
                  }
                />

                <InfoItem
                  icon={MapPin}
                  label="Location"
                  value={
                    selectedEmployee.location ||
                    "—"
                  }
                />

                <InfoItem
                  icon={UserCheck}
                  label="Status"
                  value={
                    selectedEmployee.status ||
                    "Active"
                  }
                />
              </div>

              <button
                onClick={() =>
                  setShowViewModal(false)
                }
                className="mt-6 w-full rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================
// STAT CARD
// ========================================

function EmployeeStat({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

// ========================================
// STATUS BADGE
// ========================================

function StatusBadge({ status }) {
  let className =
    "bg-slate-100 text-slate-600";

  if (status === "Active") {
    className =
      "bg-emerald-50 text-emerald-600";
  }

  if (status === "Inactive") {
    className =
      "bg-red-50 text-red-600";
  }

  if (status === "On Leave") {
    className =
      "bg-amber-50 text-amber-600";
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${className}`}
    >
      {status}
    </span>
  );
}

// ========================================
// FORM FIELD
// ========================================

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );
}

// ========================================
// INFO ITEM
// ========================================

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex gap-3">
      <div className="rounded-lg bg-slate-100 p-2">
        <Icon
          size={17}
          className="text-slate-500"
        />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default Employees;