export interface Job {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  notes: string;
  appliedDate: string;
  lastUpdated: string;
  salary?: string;
  location?: string;
  url?: string;
}

export type JobStatus =
  | "Applied"
  | "Interview Scheduled"
  | "Interview Completed"
  | "Offer Received"
  | "Rejected"
  | "Withdrawn"
  | "No Response";

export interface JobFilters {
  status?: JobStatus;
  company?: string;
  search?: string;
}

export interface JobStats {
  total: number;
  applied: number;
  interviewing: number;
  offered: number;
  rejected: number;
}
