// 用户状态枚举
const JobStatus = {
  APPLIED: "APPLIED",
  INTERVIEW_SCHEDULED: "INTERVIEW_SCHEDULED",
  INTERVIEW_COMPLETED: "INTERVIEW_COMPLETED",
  OFFER_RECEIVED: "OFFER_RECEIVED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
  ACCEPTED: "ACCEPTED",
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
    Object.values(JobStatus).includes(jobApp.status)
  );
};

const validateCreateJobApplicationRequest = (data) => {
  return (
    data &&
    typeof data.company === "string" &&
    typeof data.position === "string" &&
    Object.values(JobStatus).includes(data.status) &&
    data.appliedDate
  );
};

const validateUpdateJobApplicationRequest = (data) => {
  return (
    data &&
    (data.company === undefined || typeof data.company === "string") &&
    (data.position === undefined || typeof data.position === "string") &&
    (data.status === undefined ||
      Object.values(JobStatus).includes(data.status))
  );
};

const validateAuthRequest = (data) => {
  return (
    data && typeof data.email === "string" && typeof data.password === "string"
  );
};

module.exports = {
  JobStatus,
  validateUser,
  validateJobApplication,
  validateCreateJobApplicationRequest,
  validateUpdateJobApplicationRequest,
  validateAuthRequest,
};
