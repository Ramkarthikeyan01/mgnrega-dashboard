import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const DATA_URL = "http://localhost:5000/api/data";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(DATA_URL);
        const json = await res.json();

        console.log("✅ Sample API record:", json.records?.[0]);

        const cleaned = (json.records || []).map((r) => ({
          state: r.state_name,
          district: r.district_name,
          year: r.fin_year,
          households: Number(r.Total_Households_Worked) || 0,
          individuals: Number(r.Total_Individuals_Worked) || 0,
          wages: Number(r.Wages) || 0,
          womenDays: Number(r.Women_Persondays) || 0,
          exp: Number(r.Total_Exp) || 0,
        }));

        setData(cleaned);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const states = [...new Set(data.map((d) => d.state))].sort();

  const filtered =
    selectedState === "All"
      ? data.slice(0, 30) // show top 30 by default
      : data.filter((d) => d.state === selectedState);

  const aggregated = Object.values(
    filtered.reduce((acc, curr) => {
      if (!acc[curr.state]) {
        acc[curr.state] = {
          state: curr.state,
          totalHouseholds: 0,
          totalIndividuals: 0,
          totalExp: 0,
          totalWages: 0,
        };
      }
      acc[curr.state].totalHouseholds += curr.households;
      acc[curr.state].totalIndividuals += curr.individuals;
      acc[curr.state].totalExp += curr.exp;
      acc[curr.state].totalWages += curr.wages;
      return acc;
    }, {})
  );

  return (
    <div
      style={{
        padding: 20,
        background: "#f5f7fa",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#0066cc" }}>
        MGNREGA District Data Overview (2024–25)
      </h2>
      <p style={{ textAlign: "center", color: "#555" }}>
        Source: data.gov.in — District-wise MGNREGA Data
      </p>

      {/* Filter */}
      <div
        style={{
          textAlign: "center",
          margin: "20px 0",
        }}
      >
        <label style={{ marginRight: 8, fontWeight: 600 }}>Select State:</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 200,
          }}
        >
          <option value="All">All States</option>
          {states.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          height: 400,
        }}
      >
        {loading ? (
          <p style={{ textAlign: "center" }}>⏳ Loading data...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aggregated}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" hide={selectedState !== "All"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalHouseholds" fill="#1976d2" name="Households" />
              <Bar dataKey="totalIndividuals" fill="#4caf50" name="Individuals" />
              <Bar dataKey="totalExp" fill="#f57c00" name="Total Expenditure" />
              <Bar dataKey="totalWages" fill="#9c27b0" name="Wages" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      <div
        style={{
          marginTop: 30,
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          overflowX: "auto",
        }}
      >
        <h3 style={{ marginTop: 0 }}>District Data ({selectedState})</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#0066cc", color: "white" }}>
              <th style={{ padding: 8 }}>State</th>
              <th style={{ padding: 8 }}>District</th>
              <th style={{ padding: 8 }}>Households</th>
              <th style={{ padding: 8 }}>Individuals</th>
              <th style={{ padding: 8 }}>Women Persondays</th>
              <th style={{ padding: 8 }}>Total Expenditure</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{r.state}</td>
                <td style={{ padding: 8 }}>{r.district}</td>
                <td style={{ padding: 8 }}>{r.households}</td>
                <td style={{ padding: 8 }}>{r.individuals}</td>
                <td style={{ padding: 8 }}>{r.womenDays}</td>
                <td style={{ padding: 8 }}>{r.exp.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
