const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class JobApplicationService {
  // 创建新的求职申请
  async createJobApplication(userId, data) {
    return await prisma.jobApplication.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  // 获取用户的所有求职申请
  async getUserJobApplications(userId) {
    return await prisma.jobApplication.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  // 根据ID获取求职申请
  async getJobApplicationById(id) {
    return await prisma.jobApplication.findUnique({
      where: { id },
    });
  }

  // 更新求职申请
  async updateJobApplication(id, userId, data) {
    // 验证用户权限
    const existing = await this.getJobApplicationById(id);
    if (!existing || existing.userId !== userId) {
      throw new Error("Unauthorized or job application not found");
    }

    return await prisma.jobApplication.update({
      where: { id },
      data,
    });
  }

  // 删除求职申请
  async deleteJobApplication(id, userId) {
    // 验证用户权限
    const existing = await this.getJobApplicationById(id);
    if (!existing || existing.userId !== userId) {
      throw new Error("Unauthorized or job application not found");
    }

    await prisma.jobApplication.delete({
      where: { id },
    });
  }

  // 根据状态筛选求职申请
  async getJobApplicationsByStatus(userId, status) {
    return await prisma.jobApplication.findMany({
      where: {
        userId,
        status: status,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // 搜索求职申请
  async searchJobApplications(userId, query) {
    return await prisma.jobApplication.findMany({
      where: {
        userId,
        OR: [
          { company: { contains: query, mode: "insensitive" } },
          { position: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = { JobApplicationService };
