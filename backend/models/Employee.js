const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    department: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    joiningDate: {
      type: Date,
      default: null,
    },

    salary: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
        "On Leave",
      ],
      default: "Active",
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// IMPORTANT:
// Employee.js must use "Employee", NOT "Document"
module.exports =  mongoose.model("Employee", employeeSchema);