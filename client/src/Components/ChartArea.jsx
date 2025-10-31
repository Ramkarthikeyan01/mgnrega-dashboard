import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

export default function ChartArea({ data, view, selectedState }) {
  if (!data || data.length === 0)
    return (
      <p style={{ textAlign: "center", margin: "20px", color: "#777" }}>
        No data available
      </p>
    );

  // Format for Recharts
  const chartData = data.map((d) => ({
    name: d.state_ut,
    "2019-20": d._2019_20,
    "2020-21": d._2020_21,
    "2021-22": d._2021_22,
    "2022-23": d._2022_23,
    "2023-24": d._2023_24,
    "2024-25": d._2024_25,
  }));

  return (
    <div style={{ width: "100%", height: "400px", minHeight: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        {view === "trend" ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="2019-20" stroke="#82ca9d" />
            <Line type="monotone" dataKey="2020-21" stroke="#8884d8" />
            <Line type="monotone" dataKey="2021-22" stroke="#ffc658" />
            <Line type="monotone" dataKey="2022-23" stroke="#ff7300" />
            <Line type="monotone" dataKey="2023-24" stroke="#d32f2f" />
            <Line type="monotone" dataKey="2024-25" stroke="#1565c0" />
          </LineChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {["2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25"].map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={["#82ca9d", "#8884d8", "#ffc658", "#ff7300", "#d32f2f", "#1565c0"][i]}
                stackId={view === "stacked" ? "a" : undefined}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
