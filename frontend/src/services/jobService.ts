import { Job, JobStats } from "../types/job";

// Mock data
const mockJobs: Job[] = [
  {
    id: "1",
    company: "Google",
    position: "Software Engineer",
    status: "Applied",
    notes: "Applied through company website",
    appliedDate: "2024-01-15",
    lastStatusDate: "2024-01-15",
    lastUpdated: "2024-01-15",
    statusHistory: [
      {
        date: "2024-01-15",
        status: "Applied",
        timestamp: "2024-01-15T09:00:00Z",
      },
    ],
    salary: "$120k - $180k",
    location: "Mountain View, CA",
    url: "https://careers.google.com",
  },
  {
    id: "2",
    company: "Microsoft",
    position: "Frontend Developer",
    status: "Interviewing",
    notes: "Phone interview scheduled for next week",
    appliedDate: "2024-01-10",
    lastStatusDate: "2024-01-12",
    lastUpdated: "2024-01-12",
    statusHistory: [
      {
        date: "2024-01-10",
        status: "Applied",
        timestamp: "2024-01-10T09:00:00Z",
      },
      {
        date: "2024-01-12",
        status: "Interviewing",
        timestamp: "2024-01-12T14:30:00Z",
      },
    ],
    salary: "$110k - $160k",
    location: "Seattle, WA",
    url: "https://careers.microsoft.com",
  },
  {
    id: "3",
    company: "Apple",
    position: "iOS Developer",
    status: "Interviewing",
    notes: "Completed technical interview, waiting for feedback",
    appliedDate: "2024-01-05",
    lastStatusDate: "2024-01-18",
    lastUpdated: "2024-01-18",
    statusHistory: [
      {
        date: "2024-01-05",
        status: "Applied",
        timestamp: "2024-01-05T09:00:00Z",
      },
      {
        date: "2024-01-08",
        status: "Interviewing",
        timestamp: "2024-01-08T10:00:00Z",
      },
    ],
    salary: "$130k - $190k",
    location: "Cupertino, CA",
    url: "https://jobs.apple.com",
  },
  {
    id: "4",
    company: "Netflix",
    position: "Full Stack Engineer",
    status: "Rejected",
    notes: "Did not pass the coding challenge",
    appliedDate: "2024-01-01",
    lastStatusDate: "2024-01-20",
    lastUpdated: "2024-01-20",
    statusHistory: [
      {
        date: "2024-01-01",
        status: "Applied",
        timestamp: "2024-01-01T09:00:00Z",
      },
      {
        date: "2024-01-05",
        status: "Interviewing",
        timestamp: "2024-01-05T11:00:00Z",
      },
      {
        date: "2024-01-20",
        status: "Rejected",
        timestamp: "2024-01-20T15:30:00Z",
      },
    ],
    salary: "$140k - $200k",
    location: "Los Gatos, CA",
    url: "https://jobs.netflix.com",
  },
  {
    id: "5",
    company: "Meta",
    position: "React Developer",
    status: "Offer",
    notes: "Received offer, negotiating terms",
    appliedDate: "2023-12-20",
    lastStatusDate: "2024-01-22",
    lastUpdated: "2024-01-22",
    statusHistory: [
      {
        date: "2023-12-20",
        status: "Applied",
        timestamp: "2023-12-20T09:00:00Z",
      },
      {
        date: "2023-12-25",
        status: "Interviewing",
        timestamp: "2023-12-25T10:00:00Z",
      },
      {
        date: "2024-01-22",
        status: "Offer",
        timestamp: "2024-01-22T16:30:00Z",
      },
    ],
    salary: "$125k - $175k",
    location: "Menlo Park, CA",
    url: "https://careers.meta.com",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const jobService = {
  async getJobs(): Promise<Job[]> {
    await delay(500);
    return [...mockJobs];
  },

  async addJob(
    job: Omit<Job, "id" | "lastUpdated" | "statusHistory" | "lastStatusDate">
  ): Promise<Job> {
    await delay(300);
    const today = new Date().toISOString().split("T")[0];
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
      lastUpdated: today,
      lastStatusDate: job.appliedDate, // Initial status date is the applied date
      statusHistory: [
        {
          date: job.appliedDate,
          status: job.status,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    mockJobs.push(newJob);
    return newJob;
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    await delay(300);
    const index = mockJobs.findIndex((job) => job.id === id);
    if (index === -1) {
      throw new Error("Job not found");
    }

    const currentJob = mockJobs[index];
    const today = new Date().toISOString().split("T")[0];

    // Check if status is being updated
    const isStatusChange =
      updates.status && updates.status !== currentJob.status;

    let newStatusHistory = [...currentJob.statusHistory];
    let newLastStatusDate = currentJob.lastStatusDate;

    if (isStatusChange) {
      // Add new status to history
      newStatusHistory.push({
        date: today,
        status: updates.status!,
        timestamp: new Date().toISOString(),
      });
      // Update last status date
      newLastStatusDate = today;
    }

    // If lastStatusDate is being manually updated, don't override it
    if (updates.lastStatusDate) {
      newLastStatusDate = updates.lastStatusDate;
    }

    const updatedJob = {
      ...currentJob,
      ...updates,
      lastUpdated: today,
      statusHistory: newStatusHistory,
      lastStatusDate: newLastStatusDate,
    };
    mockJobs[index] = updatedJob;
    return updatedJob;
  },

  async deleteJob(id: string): Promise<void> {
    await delay(300);
    const index = mockJobs.findIndex((job) => job.id === id);
    if (index === -1) {
      throw new Error("Job not found");
    }
    mockJobs.splice(index, 1);
  },

  async getJobStats(): Promise<JobStats> {
    await delay(200);
    const total = mockJobs.length;
    const applied = total; // All jobs count for applied
    const rejected = mockJobs.filter((job) => job.status === "Rejected").length;
    const offered = mockJobs.filter((job) => job.status === "Offer").length;
    const inProgress = total - rejected - offered; // All jobs except Rejected and Offer

    return { total, applied, inProgress, rejected, offered };
  },
};
