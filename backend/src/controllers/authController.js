const { AuthService } = require("../services/authService");

const authService = new AuthService();

class AuthController {
  // 用户注册
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // 验证输入
      if (!email || !password || !name) {
        return res.status(400).json({
          error: "Email, password, and name are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters long",
        });
      }

      const result = await authService.register({ email, password, name });
      res.status(201).json(result);
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.message.includes("already registered")) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // 用户登录
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // 验证输入
      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      const result = await authService.login({ email, password });
      res.json(result);
    } catch (error) {
      console.error("Error during login:", error);
      if (error.message.includes("Invalid email or password")) {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // 获取当前用户信息
  async getCurrentUser(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await authService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error getting current user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // 更新用户信息
  async updateUser(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { name, email } = req.body;
      if (!name && !email) {
        return res.status(400).json({
          error: "At least one field (name or email) is required",
        });
      }

      const updatedUser = await authService.updateUser(userId, { name, email });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // 更改密码
  async changePassword(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "Current password and new password are required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: "New password must be at least 6 characters long",
        });
      }

      await authService.changePassword(userId, currentPassword, newPassword);
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.message.includes("incorrect")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = { AuthController };
