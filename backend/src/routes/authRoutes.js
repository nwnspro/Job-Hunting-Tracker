const { Router } = require("express");
const { AuthController } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));

router.get(
  "/me",
  authenticateToken,
  authController.getCurrentUser.bind(authController)
);
router.put(
  "/profile",
  authenticateToken,
  authController.updateUser.bind(authController)
);
router.put(
  "/password",
  authenticateToken,
  authController.changePassword.bind(authController)
);

module.exports = router;
