import mongoose, { Schema } from "mongoose";
import { applicationStatuses } from "../constants/application.js";

const applicationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    jdText: {
      type: String,
      default: ""
    },
    jdLink: {
      type: String,
      default: ""
    },
    notes: {
      type: String,
      default: ""
    },
    dateApplied: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: applicationStatuses,
      default: "Applied"
    },
    salaryRange: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    seniority: {
      type: String,
      default: ""
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    niceToHaveSkills: {
      type: [String],
      default: []
    },
    resumeSuggestions: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const ApplicationModel = mongoose.model("Application", applicationSchema);
