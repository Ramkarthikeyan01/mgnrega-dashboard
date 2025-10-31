import React, { useMemo } from "react";

export default function SummaryCards({ data }) {
  const summary = useMemo(() => {
    if (!data || data.length === 0) return null;

    const toNum = (val) => parseFloat(val?.toString().replace(/,/g, "")) || 0;

    const totals = {
      _2019_20: data.reduce((sum, d) => sum + toNum(d._2019_20), 0),
      _2023_24: data.reduce((sum, d) => sum + toNum(d._2023_24), 0),
    };

    const growth =
      ((totals._2023_24 - totals._2019_20) / totals._2019_20) * 100;

    const topStates = [...data]
      .sort((a, b) => toNum(b._2023_24) - toNum(a._2023_24))
      .slice(0, 5);

    return { totals, growth, topStates };
  }, [data]);

  if (!summary) return null;
  const { totals, growth, topStates } = summary;

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: 20,
      }}
    >
      <Card
        title="Total (2023–24)"
        value={totals._2023_24.toLocaleString("en-IN")}
        subtitle="Persondays generated"
        color="#1976d2"
      />
      <Card
        title="Growth since 2019–20"
        value={`${growth.toFixed(1)}%`}
        subtitle="Overall increase"
        color="#388e3c"
      />
      <div
        style={{
          background: "#fff",
          color: "#333",
          padding: 16,
          borderRadius: 10,
          width: 320,
          textAlign: "left",
          boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ margin: "0 0 6px 0", color: "#1976d2" }}>
          🏆 Top 5 States (2023–24)
        </h3>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          {topStates.map((s, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              {s.state_ut} —{" "}
              <strong>
                {parseFloat(s._2023_24)?.toLocaleString("en-IN")}
              </strong>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Card({ title, value, subtitle, color }) {
  return (
    <div
      style={{
        background: color,
        color: "white",
        padding: 16,
        borderRadius: 10,
        width: 250,
        textAlign: "center",
        boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p
        style={{
          fontSize: 22,
          fontWeight: "bold",
          margin: "6px 0",
          lineHeight: 1.4,
        }}
      >
        {value}
      </p>
      <small>{subtitle}</small>
    </div>
  );
}
