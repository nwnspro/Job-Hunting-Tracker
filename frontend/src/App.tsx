import { useState } from "react";
import { Job } from "./types/job";
import { useJobs } from "./hooks/useJobs";
import { exportToCSV } from "./utils/exportUtils";
import { Header } from "./components/Header";
import { Content } from "./components/Content";
import { Loading } from "./components/Loading";

function App() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "stats">("table");
  const [inputValue, setInputValue] = useState("");

  const {
    jobs,
    stats,
    jobsLoading,
    statsLoading,
    addJob,
    updateJob,
    deleteJob,
  } = useJobs();

  const handleAddJob = (jobData: Omit<Job, "id" | "lastUpdated">) => {
    addJob(jobData);
    setShowAddForm(false);
  };

  const handleUpdateJob = (id: string, updates: Partial<Job>) => {
    updateJob({ id, updates });
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      deleteJob(id);
    }
  };

  const handleAutoFill = () => {
    // Auto-fill functionality can be implemented here
    console.log("Auto fill clicked");
  };



  const exportData = () => {
    exportToCSV(jobs);
  };

  if (jobsLoading || statsLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#FFF7DF]">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Header
          inputValue={inputValue}
          setInputValue={setInputValue}
          onAutoFill={handleAutoFill}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Main Content Area */}
        <Content
          viewMode={viewMode}
          jobs={jobs}
          stats={stats}
          onUpdateJob={handleUpdateJob}
          onDeleteJob={handleDeleteJob}
          onAddJob={handleAddJob}
          onExport={exportData}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
        />
      </main>
    </div>
  );
}

export default App;
