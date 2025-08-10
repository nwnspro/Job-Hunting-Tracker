const { JobApplicationService } = require("../services/jobApplicationService");

const jobApplicationService = new JobApplicationService();

class JobApplicationController {
  // 创建新的求职申请
  async createJobApplication(req, res) {
    try {
      const userId = req.user?.id; // 从JWT token中获取
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const data = req.body;
      const jobApplication = await jobApplicationService.createJobApplication(
        userId,
        data
      );

      res.status(201).json(jobApplication);
    } catch (error) {
      console.error("Error creating job application:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // 获取用户的所有求职申请
  async getUserJobApplications(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const jobApplications =
        await jobApplicationService.getUserJobApplications(userId);
      res.json(jobApplications);
    } catch (error) {
      console.error("Error getting job applications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // 根据ID获取求职申请
  async getJobApplicationById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const jobApplication = await jobApplicationService.getJobApplicationById(
        id
      );
      if (!jobApplication) {
        return res.status(404).json({ error: "Job application not found" });
      }

      // 验证用户权限
      if (jobApplication.userId !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      res.json(jobApplication);
    } catch (error) {
      console.error("Error getting job application:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // 更新求职申请
  async updateJobApplication(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const data = req.body;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const updatedJobApplication =
        await jobApplicationService.updateJobApplication(id, userId, data);
      res.json(updatedJobApplication);
    } catch (error) {
      console.error("Error updating job application:", error);
      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // 删除求职申请
  async deleteJobApplication(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await jobApplicationService.deleteJobApplication(id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting job application:", error);
      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // 根据状态筛选求职申请
  async getJobApplicationsByStatus(req, res) {
    try {
      const { status } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const jobApplications =
        await jobApplicationService.getJobApplicationsByStatus(userId, status);
      res.json(jobApplications);
    } catch (error) {
      console.error("Error getting job applications by status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // 搜索求职申请
  async searchJobApplications(req, res) {
    try {
      const { q } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!q || typeof q !== "string") {
        return res.status(400).json({
          error: "Search query is required",
        });
      }

      const jobApplications = await jobApplicationService.searchJobApplications(
        userId,
        q
      );
      res.json(jobApplications);
    } catch (error) {
      console.error("Error searching job applications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = { JobApplicationController };
