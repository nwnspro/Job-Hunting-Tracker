// 工作申请状态枚举 - 匹配 Prisma schema
const JobStatus = {
  APPLIED: "APPLIED",
  INTERVIEWING: "INTERVIEWING", 
  OFFER: "OFFER",
  REJECTED: "REJECTED",
};

// 验证函数
const validateUser = (user) => {
  return (
    user &&
    typeof user.id === "string" &&
    typeof user.email === "string" &&
    typeof user.name === "string"
  );
};

const validateJobApplication = (jobApp) => {
  return (
    jobApp &&
    typeof jobApp.id === "string" &&
    typeof jobApp.userId === "string" &&
    typeof jobApp.company === "string" &&
    typeof jobApp.position === "string" &&
    Object.values(JobStatus).includes(jobApp.status) &&
    (jobApp.notes === null || typeof jobApp.notes === "string")
  );
};

const validateCreateJobApplicationRequest = (data) => {
  return (
    data &&
    typeof data.company === "string" &&
    typeof data.position === "string" &&
    Object.values(JobStatus).includes(data.status) &&
    (data.notes === undefined || data.notes === null || typeof data.notes === "string")
  );
};

const validateUpdateJobApplicationRequest = (data) => {
  return (
    data &&
    (data.company === undefined || typeof data.company === "string") &&
    (data.position === undefined || typeof data.position === "string") &&
    (data.status === undefined || Object.values(JobStatus).includes(data.status)) &&
    (data.notes === undefined || data.notes === null || typeof data.notes === "string")
  );
};

export {
  JobStatus,
  validateUser,
  validateJobApplication,
  validateCreateJobApplicationRequest,
  validateUpdateJobApplicationRequest,
};
