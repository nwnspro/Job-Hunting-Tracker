const { Router } = require("express");
const {
  JobApplicationController,
} = require("../controllers/jobApplicationController");
const { authenticateToken } = require("../middleware/auth");

const router = Router();
const jobApplicationController = new JobApplicationController();

// 所有路由都需要身份验证
router.use(authenticateToken);

// 创建新的求职申请
router.post(
  "/",
  jobApplicationController.createJobApplication.bind(jobApplicationController)
);

// 获取用户的所有求职申请
router.get(
  "/",
  jobApplicationController.getUserJobApplications.bind(jobApplicationController)
);

// 搜索求职申请
router.get(
  "/search",
  jobApplicationController.searchJobApplications.bind(jobApplicationController)
);

// 根据状态筛选求职申请
router.get(
  "/status/:status",
  jobApplicationController.getJobApplicationsByStatus.bind(
    jobApplicationController
  )
);

// 根据ID获取求职申请
router.get(
  "/:id",
  jobApplicationController.getJobApplicationById.bind(jobApplicationController)
);

// 更新求职申请
router.post(
  "/:id",
  jobApplicationController.updateJobApplication.bind(jobApplicationController)
);

// 删除求职申请
router.delete(
  "/:id",
  jobApplicationController.deleteJobApplication.bind(jobApplicationController)
);

module.exports = router;
