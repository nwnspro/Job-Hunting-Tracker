const { google } = require("googleapis");

class ExportController {
  constructor() {
    // 初始化Google Sheets API
    this.sheets = google.sheets({ version: "v4" });
  }

  // 导出到Google Sheets
  async exportToGoogleSheets(req, res) {
    try {
      const { data } = req.body;
      const userId = req.user.id; // 从认证中间件获取用户ID

      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: "无效的数据格式" });
      }

      // 配置Google Sheets API认证
      let auth;

      if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        // 使用环境变量方式认证
        auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          },
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
      } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE) {
        // 使用密钥文件方式认证
        auth = new google.auth.GoogleAuth({
          keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
      } else {
        throw new Error("Google Sheets API认证配置缺失");
      }

      const authClient = await auth.getClient();
      google.options({ auth: authClient });

      // 创建新的Google Sheets文档
      const spreadsheet = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: `Job Applications - ${
              new Date().toISOString().split("T")[0]
            }`,
          },
        },
      });

      const spreadsheetId = spreadsheet.data.spreadsheetId;

      // 准备数据
      const values = [
        ["Date", "Company", "Job", "Status", "Notes", "URL"], // 头部
        ...data.map((job) => [
          job.date,
          job.company,
          job.position,
          job.status,
          job.notes,
          job.url,
        ]),
      ];

      // 写入数据到Google Sheets
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "A1:F" + values.length,
        valueInputOption: "RAW",
        requestBody: {
          values,
        },
      });

      // 格式化表格
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              updateSheetProperties: {
                properties: {
                  sheetId: 0,
                  gridProperties: {
                    frozenRowCount: 1,
                  },
                },
                fields: "gridProperties.frozenRowCount",
              },
            },
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.2,
                      green: 0.2,
                      blue: 0.2,
                    },
                    textFormat: {
                      bold: true,
                      foregroundColor: {
                        red: 1,
                        green: 1,
                        blue: 1,
                      },
                    },
                  },
                },
                fields: "userEnteredFormat(backgroundColor,textFormat)",
              },
            },
          ],
        },
      });

      const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

      res.json({
        success: true,
        sheetUrl,
        message: "数据已成功导出到Google Sheets",
      });
    } catch (error) {
      console.error("Google Sheets导出错误:", error);
      res.status(500).json({
        error: "导出到Google Sheets失败",
        message: error.message,
      });
    }
  }

  // 导出为CSV（备用方案）
  exportToCSV(req, res) {
    try {
      const { data } = req.body;

      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: "无效的数据格式" });
      }

      // 生成CSV内容
      const headers = ["Date", "Company", "Job", "Status", "Notes", "URL"];
      const csvContent = [
        headers.join(","),
        ...data.map((job) =>
          [
            job.date,
            `"${job.company}"`,
            `"${job.position}"`,
            job.status,
            `"${job.notes || ""}"`,
            job.url || "",
          ].join(",")
        ),
      ].join("\n");

      // 设置响应头
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="job-applications-${
          new Date().toISOString().split("T")[0]
        }.csv"`
      );

      res.send(csvContent);
    } catch (error) {
      console.error("CSV导出错误:", error);
      res.status(500).json({
        error: "CSV导出失败",
        message: error.message,
      });
    }
  }
}

module.exports = { ExportController };
