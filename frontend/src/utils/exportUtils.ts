import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { Job } from "../types/job";

// CSV导出功能
export const exportToCSV = (jobs: Job[]) => {
  // 定义CSV头部
  const headers = ["Date", "Company", "Job", "Status", "Notes", "URL"];

  // 转换数据为CSV格式
  const csvContent = [
    headers.join(","),
    ...jobs.map((job) =>
      [
        job.appliedDate || "",
        `"${job.company}"`,
        `"${job.position}"`,
        job.status,
        `"${job.notes || ""}"`,
        job.url || "",
      ].join(",")
    ),
  ].join("\n");

  // 创建Blob并下载
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const fileName = `job-applications-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  saveAs(blob, fileName);
};

// Google Sheets导出功能
export const exportToGoogleSheets = async (jobs: Job[]) => {
  // 检查用户是否已登录（这里需要根据你的认证系统来实现）
  const isLoggedIn = checkUserLoginStatus();

  if (!isLoggedIn) {
    alert("请先登录以使用Google Sheets导出功能");
    return;
  }

  try {
    // 准备数据
    const data = jobs.map((job) => ({
      date: job.appliedDate || "",
      company: job.company,
      position: job.position,
      status: job.status,
      notes: job.notes || "",
      url: job.url || "",
    }));

    // 获取认证token
    const token = localStorage.getItem("authToken");

    // 创建Google Sheets API请求
    const response = await fetch("/api/export/google-sheets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        window.open(result.sheetUrl, "_blank");
      } else {
        throw new Error(result.message || "导出失败");
      }
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "导出失败");
    }
  } catch (error) {
    console.error("Google Sheets导出错误:", error);
    alert(
      `导出到Google Sheets失败: ${
        error instanceof Error ? error.message : "未知错误"
      }`
    );
  }
};

// 检查用户登录状态（需要根据你的认证系统来实现）
const checkUserLoginStatus = (): boolean => {
  // 这里需要根据你的认证系统来实现
  // 例如检查localStorage中的token，或者调用认证API
  const token = localStorage.getItem("authToken");
  return !!token;
};

// 导出Sankey diagram为图片
export const exportSankeyAsImage = async (svgElement: SVGSVGElement) => {
  try {
    // 使用html2canvas将SVG转换为图片
    const canvas = await html2canvas(svgElement as unknown as HTMLElement, {
      backgroundColor: "#ffffff",
      scale: 2, // 提高图片质量
      useCORS: true,
      allowTaint: true,
    });

    // 将canvas转换为blob并下载
    canvas.toBlob((blob) => {
      if (blob) {
        const fileName = `sankey-diagram-${
          new Date().toISOString().split("T")[0]
        }.png`;
        saveAs(blob, fileName);
      }
    }, "image/png");
  } catch (error) {
    console.error("图片导出错误:", error);
    alert("图片导出失败，请稍后重试");
  }
};

// 导出分享菜单组件的数据
export interface ExportOption {
  label: string;
  icon: string;
  action: () => void;
  disabled?: boolean;
}

export const getTableExportOptions = (jobs: Job[]): ExportOption[] => [
  {
    label: "导出为CSV",
    icon: "📊",
    action: () => exportToCSV(jobs),
  },
  {
    label: "导出到Google Sheets",
    icon: "📈",
    action: () => exportToGoogleSheets(jobs),
    disabled: !checkUserLoginStatus(),
  },
];

export const getStatsExportOptions = (
  svgElement: SVGSVGElement | null
): ExportOption[] => [
  {
    label: "下载Sankey图片",
    icon: "🖼️",
    action: () => svgElement && exportSankeyAsImage(svgElement),
    disabled: !svgElement,
  },
];
