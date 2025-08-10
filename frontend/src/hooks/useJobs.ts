import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "../services/jobService";
import { Job } from "../types/job";

export function useJobs() {
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: jobService.getJobs,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["jobStats"],
    queryFn: jobService.getJobStats,
  });

  const addJobMutation = useMutation({
    mutationFn: jobService.addJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobStats"] });
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Job> }) =>
      jobService.updateJob(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobStats"] });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: jobService.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobStats"] });
    },
  });

  return {
    jobs,
    stats,
    jobsLoading,
    statsLoading,
    addJob: addJobMutation.mutate,
    updateJob: updateJobMutation.mutate,
    deleteJob: deleteJobMutation.mutate,
    isAdding: addJobMutation.isPending,
    isUpdating: updateJobMutation.isPending,
    isDeleting: deleteJobMutation.isPending,
  };
}
