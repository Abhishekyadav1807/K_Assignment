import { ApplicationModel } from "../models/Application.js";

export const listApplications = async (userId) =>
  ApplicationModel.find({ userId }).sort({ createdAt: -1 });

export const createApplication = async (userId, input) =>
  ApplicationModel.create({
    ...input,
    userId,
    dateApplied: new Date(input.dateApplied)
  });

export const updateApplication = async (userId, applicationId, input) =>
  ApplicationModel.findOneAndUpdate(
    { _id: applicationId, userId },
    {
      ...input,
      dateApplied: new Date(input.dateApplied)
    },
    { new: true }
  );

export const updateApplicationStatus = async (userId, applicationId, status) =>
  ApplicationModel.findOneAndUpdate({ _id: applicationId, userId }, { status }, { new: true });

export const deleteApplication = async (userId, applicationId) =>
  ApplicationModel.findOneAndDelete({ _id: applicationId, userId });
