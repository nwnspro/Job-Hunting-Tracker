import { Job, JobStatus, JobStats } from "../types/job";

// Mock data
const mockJobs: Job[] = [
  {
    id: "1",
    company: "Google",
    position: "Software Engineer",
    status: "Applied",
    notes: "Applied through company website",
    appliedDate: "2024-01-15",
    lastUpdated: "2024-01-15",
    salary: "$120k - $180k",
    location: "Mountain View, CA",
    url: "https://careers.google.com",
  },
  {
    id: "2",
    company: "Microsoft",
    position: "Frontend Developer",
    status: "Interview Scheduled",
    notes: "Phone interview scheduled for next week",
    appliedDate: "2024-01-10",
    lastUpdated: "2024-01-12",
    salary: "$110k - $160k",
    location: "Seattle, WA",
    url: "https://careers.microsoft.com",
  },
  {
    id: "3",
    company: "Apple",
    position: "iOS Developer",
    status: "Interview Completed",
    notes: "Completed technical interview, waiting for feedback",
    appliedDate: "2024-01-05",
    lastUpdated: "2024-01-18",
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
    lastUpdated: "2024-01-20",
    salary: "$140k - $200k",
    location: "Los Gatos, CA",
    url: "https://jobs.netflix.com",
  },
  {
    id: "5",
    company: "Meta",
    position: "React Developer",
    status: "Offer Received",
    notes: "Received offer, negotiating terms",
    appliedDate: "2023-12-20",
    lastUpdated: "2024-01-22",
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

  async addJob(job: Omit<Job, "id" | "lastUpdated">): Promise<Job> {
    await delay(300);
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString().split("T")[0],
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

    const updatedJob = {
      ...mockJobs[index],
      ...updates,
      lastUpdated: new Date().toISOString().split("T")[0],
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
    const applied = mockJobs.filter((job) => job.status === "Applied").length;
    const interviewing = mockJobs.filter(
      (job) =>
        job.status === "Interview Scheduled" ||
        job.status === "Interview Completed"
    ).length;
    const offered = mockJobs.filter(
      (job) => job.status === "Offer Received"
    ).length;
    const rejected = mockJobs.filter((job) => job.status === "Rejected").length;

    return { total, applied, interviewing, offered, rejected };
  },
};
