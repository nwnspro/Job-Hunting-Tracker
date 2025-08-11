export interface StatusHistoryEntry {
  date: string;
  status: JobStatus;
  timestamp: string; // When this status change was recorded
}

export interface Job {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  notes: string;
  appliedDate: string; // Initial application date
  lastStatusDate: string; // Date of the most recent status (displayed in table)
  lastUpdated: string;
  statusHistory: StatusHistoryEntry[]; // Complete history of status changes
  salary?: string;
  location?: string;
  url?: string;
}

export type JobStatus = "Applied" | "Interviewing" | "Rejected" | "Offer";

export interface JobFilters {
  status?: JobStatus;
  company?: string;
  search?: string;
}

export interface JobStats {
  total: number;
  applied: number;
  inProgress: number; // All jobs except Rejected and Offer
  rejected: number;
  offered: number;
}
