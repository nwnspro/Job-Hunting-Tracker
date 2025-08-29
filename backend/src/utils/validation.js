class ValidationUtils {
  // 验证邮箱格式
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 验证密码强度
  static isStrongPassword(password) {
    // 至少8个字符，包含大小写字母、数字和特殊字符
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // 验证求职申请数据
  static validateJobApplication(data) {
    const errors = [];

    if (!data.company || data.company.trim().length === 0) {
      errors.push("Company name is required");
    }

    if (!data.position || data.position.trim().length === 0) {
      errors.push("Position is required");
    }

    if (!data.appliedDate) {
      errors.push("Applied date is required");
    }

    if (data.jobUrl && !this.isValidUrl(data.jobUrl)) {
      errors.push("Invalid job URL format");
    }

    if (data.contactEmail && !this.isValidEmail(data.contactEmail)) {
      errors.push("Invalid contact email format");
    }

    return errors;
  }

  // 验证URL格式
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // 验证日期格式
  static isValidDate(date) {
    if (!date) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }

  // 清理和验证字符串输入
  static sanitizeString(input) {
    return input.trim().replace(/\s+/g, " ");
  }

  // 验证分页参数
  static validatePagination(page, limit) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    return {
      page: Math.max(1, pageNum),
      limit: Math.min(100, Math.max(1, limitNum)),
    };
  }
}

export { ValidationUtils };
