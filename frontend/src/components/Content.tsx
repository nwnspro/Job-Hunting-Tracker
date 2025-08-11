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
  const [editingRow, setEditingRow] = useState<string | null>(null);
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

  // Format date - only show application date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-CA"); // Returns YYYY-MM-DD format
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
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="relative w-full flex items-center">
            {/* Search Icon */}
            <div className="flex-shrink-0 mr-3">
              {showSadFace ? (
                <Frown className="w-4 h-4  text-gray-400" />
              ) : (
                <Search className="w-4 h-4 text-gray-400" />
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={
                  filteredJobs.length === 0 && searchQuery
                    ? "No records"
                    : "Looking for anything?"
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 px-0 py-1 bg-transparent text-black placeholder-gray-500  focus:outline-none "
              />
            </div>

            {/* Add and Share Icons */}
            <div className="flex-shrink-0 ml-1 flex items-center gap-2">
              <button
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <Share2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col h-[calc(100%-61px)]">
          {/* Table Header - Fixed */}
          <div className="bg-gray-100 border-b border-gray-200 flex-shrink-0">
            <div className="grid grid-cols-[150px_200px_200px_180px_1fr] gap-0">
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
              <div className="p-3 font-medium text-gray-700">Notes</div>
            </div>
          </div>

          {/* Table Body - Conditional Scrollable */}
          <div
            className={`flex-1 min-h-0 ${
              sortedJobs.length > 10 ? "overflow-y-auto" : "overflow-y-hidden"
            }`}
          >
            {/* Add Job Form Row */}
            {showAddForm && (
              <div className="grid grid-cols-[150px_200px_200px_180px_1fr] gap-0 border-b border-gray-200 bg-blue-50 p-2">
                {/* Date Input */}
                <div className="p-2 border-r border-gray-100">
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full h-8 px-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="add-date"
                  />
                </div>

                {/* Company Input */}
                <div className="p-2 border-r border-gray-100">
                  <input
                    type="text"
                    placeholder="Company name"
                    className="w-full h-8 px-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="add-company"
                  />
                </div>

                {/* Job Input */}
                <div className="p-2 border-r border-gray-100">
                  <input
                    type="text"
                    placeholder="Job title"
                    className="w-full h-8 px-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="add-position"
                  />
                </div>

                {/* Status Select */}
                <div className="p-2 border-r border-gray-100">
                  <select
                    defaultValue="Applied"
                    className="w-full h-8 px-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="add-status"
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
                </div>

                {/* Notes Input with Action Buttons */}
                <div className="p-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add notes..."
                    className="flex-1 h-8 px-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="add-notes"
                  />
                  <button
                    onClick={() => {
                      const dateEl = document.getElementById(
                        "add-date"
                      ) as HTMLInputElement;
                      const companyEl = document.getElementById(
                        "add-company"
                      ) as HTMLInputElement;
                      const positionEl = document.getElementById(
                        "add-position"
                      ) as HTMLInputElement;
                      const statusEl = document.getElementById(
                        "add-status"
                      ) as HTMLSelectElement;
                      const notesEl = document.getElementById(
                        "add-notes"
                      ) as HTMLInputElement;

                      if (companyEl.value && positionEl.value) {
                        onAddJob({
                          company: companyEl.value,
                          position: positionEl.value,
                          status: statusEl.value as any,
                          notes: notesEl.value,
                          appliedDate: dateEl.value,
                          salary: "",
                          location: "",
                          url: "",
                        });
                        setShowAddForm(false);
                      }
                    }}
                    className="w-6 h-6 bg-green-100 rounded flex items-center justify-center hover:bg-green-200 transition-colors"
                    title="Save"
                  >
                    <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="w-6 h-6 bg-red-100 rounded flex items-center justify-center hover:bg-red-200 transition-colors"
                    title="Cancel"
                  >
                    <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
                  </button>
                </div>
              </div>
            )}

            {/* Render Jobs */}
            <div className="min-h-full">
              {sortedJobs.map((job, index) => (
                <div
                  key={job.id}
                  className={`grid grid-cols-[150px_200px_200px_180px_1fr] gap-0 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {/* Date Field */}
                  <div
                    className={`p-3 border-r border-gray-100 ${
                      editingRow === job.id ? "cursor-pointer" : ""
                    }`}
                    onClick={() =>
                      editingRow === job.id && handleCellClick(job.id, "date")
                    }
                  >
                    {editingRow === job.id &&
                    editingCell?.id === job.id &&
                    editingCell?.field === "date" ? (
                      <input
                        type="date"
                        value={job.appliedDate}
                        onChange={(e) =>
                          handleCellEdit(job.id, "appliedDate", e.target.value)
                        }
                        className="w-full p-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        autoFocus
                      />
                    ) : (
                      <span className="text-gray-600 text-sm">
                        {formatDate(job.appliedDate)}
                      </span>
                    )}
                  </div>

                  {/* Company Field */}
                  <div
                    className={`p-3 border-r border-gray-100 ${
                      editingRow === job.id ? "cursor-pointer" : ""
                    }`}
                    onClick={() =>
                      editingRow === job.id &&
                      handleCellClick(job.id, "company")
                    }
                  >
                    {editingRow === job.id &&
                    editingCell?.id === job.id &&
                    editingCell?.field === "company" ? (
                      <input
                        type="text"
                        value={job.company}
                        onChange={(e) =>
                          handleCellEdit(job.id, "company", e.target.value)
                        }
                        className="w-full p-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <span className="text-gray-800">{job.company}</span>
                    )}
                  </div>

                  {/* Position Field */}
                  <div
                    className={`p-3 border-r border-gray-100 ${
                      editingRow === job.id ? "cursor-pointer" : ""
                    }`}
                    onClick={() =>
                      editingRow === job.id &&
                      handleCellClick(job.id, "position")
                    }
                  >
                    {editingRow === job.id &&
                    editingCell?.id === job.id &&
                    editingCell?.field === "position" ? (
                      <input
                        type="text"
                        value={job.position}
                        onChange={(e) =>
                          handleCellEdit(job.id, "position", e.target.value)
                        }
                        className="w-full p-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <span className="text-gray-800">{job.position}</span>
                    )}
                  </div>

                  {/* Status Field */}
                  <div
                    className={`p-3 border-r border-gray-100 ${
                      editingRow === job.id ? "cursor-pointer" : ""
                    }`}
                    onClick={() =>
                      editingRow === job.id && handleCellClick(job.id, "status")
                    }
                  >
                    {editingRow === job.id &&
                    editingCell?.id === job.id &&
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

                  {/* Notes Field with Action Buttons */}
                  <div className="p-3 flex items-center gap-2">
                    <div
                      className={`flex-1 ${
                        editingRow === job.id ? "cursor-pointer" : ""
                      }`}
                      onClick={() =>
                        editingRow === job.id &&
                        handleCellClick(job.id, "notes")
                      }
                    >
                      {editingRow === job.id &&
                      editingCell?.id === job.id &&
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

                    {/* Action Buttons */}
                    <button
                      onClick={() => {
                        // Toggle edit mode for the entire row
                        if (editingRow === job.id) {
                          setEditingRow(null);
                          setEditingCell(null);
                        } else {
                          setEditingRow(job.id);
                          setEditingCell(null);
                        }
                      }}
                      className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                        editingRow === job.id
                          ? "bg-green-100 hover:bg-green-200"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      title={editingRow === job.id ? "Exit Edit" : "Edit"}
                    >
                      <div
                        className={`w-3 h-3 rounded-sm ${
                          editingRow === job.id ? "bg-green-600" : "bg-gray-400"
                        }`}
                      ></div>
                    </button>
                    <button
                      onClick={() => onDeleteJob(job.id)}
                      className="w-6 h-6 bg-red-100 rounded flex items-center justify-center hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty state when no jobs */}
              {sortedJobs.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-500 min-h-[300px]">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    </div>
                    <p className="text-lg font-medium">
                      No job applications found
                    </p>
                    <p className="text-sm">
                      Try searching for a different company
                    </p>
                  </div>
                </div>
              )}

              {/* Add empty rows to fill space only when not scrolling */}
              {sortedJobs.length <= 10 &&
                Array.from({
                  length: Math.max(10 - sortedJobs.length, 0),
                }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className={`grid grid-cols-[150px_200px_200px_180px_1fr] gap-0 border-b border-gray-100 h-12 ${
                      (sortedJobs.length + index) % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="p-3 border-r border-gray-100"></div>
                    <div className="p-3 border-r border-gray-100"></div>
                    <div className="p-3 border-r border-gray-100"></div>
                    <div className="p-3 border-r border-gray-100"></div>
                    <div className="p-3"></div>
                  </div>
                ))}

              {/* Add extra scrollable content when there are many jobs */}
              {sortedJobs.length > 10 &&
                Array.from({
                  length: 5,
                }).map((_, index) => (
                  <div
                    key={`extra-${index}`}
                    className={`grid grid-cols-[150px_200px_200px_180px_1fr] gap-0 border-b border-gray-100 h-12 ${
                      (sortedJobs.length + index) % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="p-3 border-r border-gray-100"></div>
                    <div className="p-3 border-r border-gray-100"></div>
                    <div className="p-3 border-r border-gray-100"></div>
                    <div className="p-3 border-r border-gray-100"></div>
                    <div className="p-3"></div>
                  </div>
                ))}
            </div>
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
