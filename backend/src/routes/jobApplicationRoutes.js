import { Router } from "express";
import { JobApplicationController } from "../controllers/jobApplicationController.js";

const router = Router();
const jobApplicationController = new JobApplicationController();

// Note: JWT auth removed, using BetterAuth instead

// Create job application
router.post(
  "/",
  jobApplicationController.createJobApplication.bind(jobApplicationController)
);

// Get user job applications
router.get(
  "/",
  jobApplicationController.getUserJobApplications.bind(jobApplicationController)
);

// Search job applications
router.get(
  "/search",
  jobApplicationController.searchJobApplications.bind(jobApplicationController)
);

// Filter by status
router.get(
  "/status/:status",
  jobApplicationController.getJobApplicationsByStatus.bind(
    jobApplicationController
  )
);

// Get by ID
router.get(
  "/:id",
  jobApplicationController.getJobApplicationById.bind(jobApplicationController)
);

// Update job application
router.post(
  "/:id",
  jobApplicationController.updateJobApplication.bind(jobApplicationController)
);

// Delete job application
router.delete(
  "/:id",
  jobApplicationController.deleteJobApplication.bind(jobApplicationController)
);

export default router;
