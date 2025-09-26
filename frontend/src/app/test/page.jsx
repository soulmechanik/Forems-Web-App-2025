"use client";

import { useState } from "react";
import axios from "axios";

export default function Page() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5002/api/auth/me", {
        withCredentials: true, // important to send cookies
      });
      console.log("API response:", res.data);
      setResult(res.data);
    } catch (err) {
      console.error("Auth API error:", err.response?.data || err.message);
      setResult(err.response?.data || { message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Test Auth API</h1>
      <button onClick={testAuth} disabled={loading} style={{ padding: "0.5rem 1rem", margin: "1rem 0" }}>
        {loading ? "Testing..." : "Test"}
      </button>

      {result && (
        <pre
          style={{
            background: "#f0f0f0",
            padding: "1rem",
            borderRadius: "0.5rem",
            overflowX: "auto",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
