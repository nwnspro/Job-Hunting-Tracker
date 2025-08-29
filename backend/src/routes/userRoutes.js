import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Get current user info
router.get("/me", requireAuth, (req, res) => {
  try {
    res.json({
      user: req.user,
      session: req.session,
    });
  } catch (error) {
    console.error("Error getting user info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
