const { Router } = require("express");
const { ExportController } = require("../controllers/exportController");
const { authenticateToken } = require("../middleware/auth");

const router = Router();
const exportController = new ExportController();

router.use(authenticateToken);

router.post(
  "/google-sheets",
  exportController.exportToGoogleSheets.bind(exportController)
);

router.post("/csv", exportController.exportToCSV.bind(exportController));

module.exports = router;
