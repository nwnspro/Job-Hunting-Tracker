import { Job } from "../types/job";

export function exportJobsToCSV(jobs: Job[]) {
  const csvContent = [
    [
      "Company",
      "Position",
      "Status",
      "Notes",
      "Applied Date",
      "Salary",
      "Location",
      "URL",
    ],
    ...jobs.map((job) => [
      job.company,
      job.position,
      job.status,
      job.notes,
      job.appliedDate,
      job.salary || "",
      job.location || "",
      job.url || "",
    ]),
  ]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "job-applications.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}
