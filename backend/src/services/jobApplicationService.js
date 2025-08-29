import { PrismaClient } from '@prisma/client';
import { ValidationUtils } from '../utils/validation.js';

const prisma = new PrismaClient();

class JobApplicationService {
  // Create job application
  async createJobApplication(userId, data) {
    // Validate input data
    const validation = ValidationUtils.validateCreateJobApplicationRequest(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const jobApplicationData = {
      userId,
      company: data.company.trim(),
      position: data.position ? data.position.trim() : data.company.trim() + ' Position',
      status: data.status || 'APPLIED',
      notes: data.notes || null,
      url: data.url || null,
      appliedDate: data.appliedDate ? new Date(data.appliedDate) : new Date(),
    };

    return await prisma.jobApplication.create({
      data: jobApplicationData,
    });
  }

  // Get all job applications for user
  async getUserJobApplications(userId, options = {}) {
    const { 
      status, 
      page = 1, 
      pageSize = 50, 
      sortBy = 'appliedDate', 
      sortOrder = 'desc' 
    } = options;

    const where = { userId };
    if (status) {
      where.status = status;
    }

    const orderBy = { [sortBy]: sortOrder };
    const skip = (page - 1) * pageSize;

    const [total, jobApplications] = await Promise.all([
      prisma.jobApplication.count({ where }),
      prisma.jobApplication.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
    ]);

    return {
      jobApplications,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // Get job application by ID
  async getJobApplicationById(id) {
    return await prisma.jobApplication.findUnique({
      where: { id },
    });
  }

  // Update job application
  async updateJobApplication(id, userId, data) {
    // Check if job application exists and belongs to user
    const existingJobApplication = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!existingJobApplication) {
      throw new Error('Job application not found');
    }

    if (existingJobApplication.userId !== userId) {
      throw new Error('Unauthorized: Cannot update this job application');
    }

    // Validate update data
    const validation = ValidationUtils.validateUpdateJobApplicationRequest(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Prepare update data
    const updateData = {};
    if (data.company) updateData.company = data.company.trim();
    if (data.position) updateData.position = data.position.trim();
    if (data.status) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.appliedDate) updateData.appliedDate = new Date(data.appliedDate);

    return await prisma.jobApplication.update({
      where: { id },
      data: updateData,
    });
  }

  // Delete job application
  async deleteJobApplication(id, userId) {
    // Check if job application exists and belongs to user
    const existingJobApplication = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!existingJobApplication) {
      throw new Error('Job application not found');
    }

    if (existingJobApplication.userId !== userId) {
      throw new Error('Unauthorized: Cannot delete this job application');
    }

    await prisma.jobApplication.delete({
      where: { id },
    });
  }

  // Get job applications by status
  async getJobApplicationsByStatus(userId, status) {
    return await prisma.jobApplication.findMany({
      where: {
        userId,
        status,
      },
      orderBy: {
        appliedDate: 'desc',
      },
    });
  }

  // Search job applications
  async searchJobApplications(userId, query) {
    return await prisma.jobApplication.findMany({
      where: {
        userId,
        OR: [
          {
            company: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            position: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            notes: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        appliedDate: 'desc',
      },
    });
  }
}

export { JobApplicationService };
