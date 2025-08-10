import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { JobStats } from "../types/job";

interface JobStatsProps {
  stats: JobStats;
}

const COLORS = ["#3b82f6", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444"];

export function JobStatsComponent({ stats }: JobStatsProps) {
  const data = [
    { name: "Applied", value: stats.applied, color: COLORS[0] },
    { name: "Interviewing", value: stats.interviewing, color: COLORS[1] },
    { name: "Offered", value: stats.offered, color: COLORS[2] },
    { name: "Rejected", value: stats.rejected, color: COLORS[3] },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Application Overview</h3>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-blue-600">Total Applications</div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.applied}
            </div>
            <div className="text-sm text-yellow-600">Applied</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">
              {stats.interviewing}
            </div>
            <div className="text-sm text-purple-600">Interviewing</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">
              {stats.offered}
            </div>
            <div className="text-sm text-green-600">Offers</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg border">
          <h4 className="text-md font-medium mb-4 text-center">
            Application Status Distribution
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
