// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import UploadSection from "./UploadSection";
import FilesSection from "./FilesSection";
import "./Dashboard.css";

export default function Dashboard({ isLoggedIn, loading, login, logout, idToken, email }) {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Whenever login changes, refresh list
    if (isLoggedIn) setRefreshKey((k) => k + 1);
  }, [isLoggedIn]);

  return (
    <div className="page">
      <div className="hero">
        <h1>Scalable File Storage App</h1>
        <p>Secure cloud storage using AWS Cognito + Identity Pool + Amazon S3</p>

        <div className="topbar">
          {!isLoggedIn ? (
            <button className="btn primary" onClick={login} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          ) : (
            <div className="pillRow">
              <div className="pill">
                <span className="dot" />
                Logged in as: <b>{email || "Logged in user"}</b>
              </div>
              <button className="btn danger" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {!isLoggedIn ? (
        <div className="empty">
          <div className="emptyCard">
            <h3>Please log in first.</h3>
            <p>Click Login to authenticate using Cognito Hosted UI.</p>
          </div>
        </div>
      ) : (
        <div className="grid">
          <UploadSection idToken={idToken} onUploaded={() => setRefreshKey((k) => k + 1)} />
          <FilesSection idToken={idToken} refreshKey={refreshKey} />
        </div>
      )}
    </div>
  );
}
