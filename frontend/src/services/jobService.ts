import { Job, JobStats } from "../types/job";

const API_BASE_URL = "http://localhost:3001/api";

// Helper function to make authenticated API requests
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Include cookies for authentication
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const jobService = {
  async getJobs(): Promise<Job[]> {
    const result = await apiRequest<{jobApplications: Job[]}>('/applications');
    return result.jobApplications || [];
  },

  async addJob(jobData: Omit<Job, "id" | "userId" | "updatedAt">): Promise<Job> {
    return await apiRequest<Job>('/applications', {
      method: 'POST',
      body: JSON.stringify({
        company: jobData.company,
        position: jobData.position,
        status: jobData.status,
        notes: jobData.notes || null,
        url: jobData.url || null,
        appliedDate: jobData.appliedDate,
      }),
    });
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    return await apiRequest<Job>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteJob(id: string): Promise<void> {
    await apiRequest(`/applications/${id}`, {
      method: 'DELETE',
    });
  },

  async getJobStats(): Promise<JobStats> {
    const jobs = await this.getJobs();
    const total = jobs.length;
    const applied = total;
    const rejected = jobs.filter((job) => job.status === "REJECTED").length;
    const offered = jobs.filter((job) => job.status === "OFFER").length;
    const inProgress = jobs.filter((job) => job.status === "INTERVIEWING").length;

    return { total, applied, inProgress, rejected, offered };
  },
};
