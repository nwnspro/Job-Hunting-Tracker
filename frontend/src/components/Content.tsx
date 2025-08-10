import React, { useState, useMemo } from "react";
import { JobTable } from "./JobTable";
import { JobStatsComponent } from "./JobStats";
import { Job } from "../types/job";
import { Search, Frown, Share2, Plus, Download } from "lucide-react";
import { Button } from "./ui/button";
import { AddJobForm } from "./AddJobForm";

interface ContentProps {
  viewMode: "table" | "stats";
  jobs: Job[];
  stats: any;
  onUpdateJob: (id: string, updates: Partial<Job>) => void;
  onDeleteJob: (id: string) => void;
  onAddJob: (jobData: Omit<Job, "id" | "lastUpdated">) => void;
  onExport: () => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
}

export function Content({
  viewMode,
  jobs,
  stats,
  onUpdateJob,
  onDeleteJob,
  onAddJob,
  onExport,
  showAddForm,
  setShowAddForm,
}: ContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<"date" | "status">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: string;
  } | null>(null);
  const [showSadFace, setShowSadFace] = useState(false);

  // Search functionality
  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs;
    const filtered = jobs.filter((job) =>
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length === 0) {
      setShowSadFace(true);
      setTimeout(() => setShowSadFace(false), 3000);
    } else {
      setShowSadFace(false);
    }

    return filtered;
  }, [jobs, searchQuery]);

  // Sort functionality
  const sortedJobs = useMemo(() => {
    const sorted = [...filteredJobs].sort((a, b) => {
      if (sortColumn === "date") {
        const dateA = new Date(a.appliedDate);
        const dateB = new Date(b.appliedDate);
        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else {
        return sortDirection === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
    });
    return sorted;
  }, [filteredJobs, sortColumn, sortDirection]);

  // Format date based on status
  const formatDate = (date: string, status: string) => {
    const baseDate = "2025.01.01";
    if (
      status === "Applied" ||
      status === "Interview Scheduled" ||
      status === "No Response"
    ) {
      return baseDate + "-";
    } else {
      return baseDate + "-2025.01.02";
    }
  };

  // Handle cell editing
  const handleCellClick = (jobId: string, field: string) => {
    setEditingCell({ id: jobId, field });
  };

  const handleCellEdit = (jobId: string, field: string, value: string) => {
    onUpdateJob(jobId, { [field]: value });
    setEditingCell(null);
  };

  if (viewMode === "table") {
    return (
      <div className="w-[1260px] h-[530px] bg-white rounded-[20px] shadow-[0px_24px_80px_-40px_rgba(0,0,0,0.25)] relative">
        {/* Company Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={
                filteredJobs.length === 0 && searchQuery
                  ? "No records"
                  : "Search company name..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-4 py-2 pl-10 border border-gray-200 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {showSadFace ? (
                <Frown className="w-4 h-4 text-red-500" />
              ) : (
                <Search className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Add Job Form */}
        {showAddForm && (
          <div className="p-4 border-b border-gray-200">
            <AddJobForm
              onAddJob={onAddJob}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Table */}
        <div className="h-[calc(100%-74px)]">
          {/* Table Header */}
          <div className="bg-gray-100 border-b border-gray-200">
            <div className="grid grid-cols-6 gap-0">
              <button
                onClick={() => {
                  setSortColumn("date");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}
                className="p-3 font-medium text-gray-700 border-r border-gray-200 text-left hover:bg-gray-200 transition-colors"
              >
                Date{" "}
                {sortColumn === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </button>
              <div className="p-3 font-medium text-gray-700 border-r border-gray-200">
                Company
              </div>
              <div className="p-3 font-medium text-gray-700 border-r border-gray-200">
                Job
              </div>
              <button
                onClick={() => {
                  setSortColumn("status");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}
                className="p-3 font-medium text-gray-700 border-r border-gray-200 text-left hover:bg-gray-200 transition-colors"
              >
                Status{" "}
                {sortColumn === "status" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </button>
              <div className="p-3 font-medium text-gray-700 border-r border-gray-200">
                Notes
              </div>
              <div className="p-3 font-medium text-gray-700">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="overflow-y-auto h-[calc(100%-52px)]">
            {sortedJobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                </div>
                <p className="text-lg font-medium">No job applications found</p>
                <p className="text-sm">Try searching for a different company</p>
              </div>
            ) : (
              sortedJobs.map((job, index) => (
                <div
                  key={job.id}
                  className={`grid grid-cols-6 gap-0 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index === 0
                      ? "bg-blue-50"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="p-3 border-r border-gray-100 text-gray-600 text-sm">
                    {formatDate(job.appliedDate, job.status)}
                  </div>
                  <div className="p-3 border-r border-gray-100 text-gray-800">
                    {job.company}
                  </div>
                  <div className="p-3 border-r border-gray-100 text-gray-800">
                    {job.position}
                  </div>
                  <div
                    className="p-3 border-r border-gray-100 cursor-pointer"
                    onClick={() => handleCellClick(job.id, "status")}
                  >
                    {editingCell?.id === job.id &&
                    editingCell?.field === "status" ? (
                      <select
                        value={job.status}
                        onChange={(e) =>
                          handleCellEdit(job.id, "status", e.target.value)
                        }
                        className="w-full p-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview Scheduled">
                          Interview Scheduled
                        </option>
                        <option value="Interview Completed">
                          Interview Completed
                        </option>
                        <option value="Offer Received">Offer Received</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Withdrawn">Withdrawn</option>
                        <option value="No Response">No Response</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === "Applied"
                            ? "bg-blue-100 text-blue-800"
                            : job.status === "Interview Scheduled"
                            ? "bg-yellow-100 text-yellow-800"
                            : job.status === "Interview Completed"
                            ? "bg-purple-100 text-purple-800"
                            : job.status === "Offer Received"
                            ? "bg-green-100 text-green-800"
                            : job.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : job.status === "Withdrawn"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    )}
                  </div>
                  <div
                    className="p-3 border-r border-gray-100 cursor-pointer"
                    onClick={() => handleCellClick(job.id, "notes")}
                  >
                    {editingCell?.id === job.id &&
                    editingCell?.field === "notes" ? (
                      <input
                        type="text"
                        value={job.notes || ""}
                        onChange={(e) =>
                          handleCellEdit(job.id, "notes", e.target.value)
                        }
                        className="w-full p-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <span className="text-gray-600 text-sm">
                        {job.notes || "Add notes..."}
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex items-center gap-2">
                    <button
                      onClick={() => onUpdateJob(job.id, { status: "Applied" })}
                      className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                    </button>
                    <button
                      onClick={() => onDeleteJob(job.id)}
                      className="w-6 h-6 bg-red-100 rounded flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[1241px] h-[500px] bg-white rounded-[20px] shadow-[0px_24px_80px_-40px_rgba(0,0,0,0.25)] p-6">
      {stats && <JobStatsComponent stats={stats} />}
    </div>
  );
}
