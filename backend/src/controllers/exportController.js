import { google } from "googleapis";

class ExportController {
  constructor() {
    // 初始化Google Sheets API
    this.sheets = google.sheets({ version: "v4" });
  }

  // Export to Google Sheets
  async exportToGoogleSheets(req, res) {
    try {
      const { data } = req.body;
      const userId = req.user.id; // Get user ID from authentication middleware

      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      // Configure Google Sheets API authentication
      let auth;

      if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        // Use environment variables for authentication
        auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          },
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
      } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE) {
        // Use key file for authentication
        auth = new google.auth.GoogleAuth({
          keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
      } else {
        throw new Error(
          "Google Sheets API authentication configuration missing"
        );
      }

      const authClient = await auth.getClient();
      google.options({ auth: authClient });

      // Create new Google Sheets document
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

      // Prepare data
      const values = [
        ["Date", "Company", "Job", "Status", "Notes", "URL"], // Headers
        ...data.map((job) => [
          job.date,
          job.company,
          job.position,
          job.status,
          job.notes,
          job.url,
        ]),
      ];

      // Write data to Google Sheets
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "A1:F" + values.length,
        valueInputOption: "RAW",
        requestBody: {
          values,
        },
      });

      // Format table
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
        message: "Data successfully exported to Google Sheets",
      });
    } catch (error) {
      console.error("Google Sheets export error:", error);
      res.status(500).json({
        error: "Failed to export to Google Sheets",
        message: error.message,
      });
    }
  }

  // Export as CSV (backup option)
  exportToCSV(req, res) {
    try {
      const { data } = req.body;

      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      // Generate CSV content
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

      // Set response headers
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="job-applications-${
          new Date().toISOString().split("T")[0]
        }.csv"`
      );

      res.send(csvContent);
    } catch (error) {
      console.error("CSV export error:", error);
      res.status(500).json({
        error: "CSV export failed",
        message: error.message,
      });
    }
  }
}

export { ExportController };
