import React from "react";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#0066cc",
          color: "white",
          padding: "15px 10px",
          textAlign: "center",
          fontSize: "22px",
          fontWeight: "bold",
          letterSpacing: "0.5px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        MGNREGA Data Dashboard
      </header>

      {/* Main content container */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            padding: "20px",
            minHeight: "80vh",
          }}
        >
          <Dashboard />
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#222",
          color: "#fff",
          textAlign: "center",
          padding: "12px 8px",
          fontSize: "14px",
          letterSpacing: "0.3px",
        }}
      >
        © 2025 MGNREGA Dashboard | Built with ❤️ by Tech OGs
      </footer>
    </div>
  );
}

export default App;
