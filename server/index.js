import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000; // ✅ dynamic port for Render

app.use(cors());

const CACHE_FILE = "./dataCache.json";

// ✅ Replace with your correct API URL and key
const API_URL =
  "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722?api-key=579b464db66ec23bdd0000010306fffd861b410b70cea83c4a8fed44&format=json&limit=1000";

// ✅ Helper function to check cache freshness (6 hours)
const isCacheFresh = () => {
  try {
    if (!fs.existsSync(CACHE_FILE)) return false;
    const stats = fs.statSync(CACHE_FILE);
    const age = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);
    return age < 6; // less than 6 hours old
  } catch (err) {
    console.error("Cache freshness check failed:", err);
    return false;
  }
};

// ✅ Main API route
app.get("/api/data", async (req, res) => {
  try {
    // Serve from cache if still fresh
    if (isCacheFresh()) {
      console.log("📦 Serving data from cache");
      const cachedData = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
      return res.json(cachedData);
    }

    // Otherwise fetch fresh data
    console.log("🌐 Fetching fresh data from data.gov.in...");
    const response = await fetch(API_URL);
    const text = await response.text();

    // Check if API responded with valid JSON
    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from API");
    }

    const data = JSON.parse(text);

    // Check for valid API key / data format
    if (!data || data.error || !data.records) {
      throw new Error(
        data.error || "Invalid response format — check your API key or dataset ID"
      );
    }

    // Save cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    console.log("✅ Data cached successfully");

    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// ✅ Start the server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
