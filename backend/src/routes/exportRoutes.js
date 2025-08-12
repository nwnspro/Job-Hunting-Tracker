const { Router } = require("express");
const { ExportController } = require("../controllers/exportController");
const { authenticateToken } = require("../middleware/auth");

const router = Router();
const exportController = new ExportController();

// 所有导出路由都需要身份验证
router.use(authenticateToken);

// 导出到Google Sheets
router.post(
  "/google-sheets",
  exportController.exportToGoogleSheets.bind(exportController)
);

// 导出为CSV
router.post("/csv", exportController.exportToCSV.bind(exportController));

module.exports = router;
