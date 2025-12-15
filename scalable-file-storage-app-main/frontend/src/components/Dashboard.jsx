// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { uploadFile, listFiles, deleteFile } from "../services/s3FileService";
import "./Dashboard.css";

const Dashboard = () => {
  const auth = useAuth();
  const idToken = auth?.user?.id_token;
  const email =
    auth?.user?.profile?.email ||
    auth?.user?.profile?.preferred_username ||
    "";

  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
const [previewName, setPreviewName] = useState("");

  const isLoggedIn = !!idToken;

  async function refreshFiles() {
    try {
      setLoading(true);
      setMessage("");
      const items = await listFiles(idToken);
      setFiles(items);
    } catch (err) {
      console.error(err);
      setMessage("Failed to list files.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      refreshFiles();
    }
  }, [isLoggedIn]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !idToken) return;

    try {
      setLoading(true);
      setMessage("Uploading...");
      await uploadFile(idToken, selectedFile);
      setMessage("Upload successful!");
      setSelectedFile(null);
      await refreshFiles();
    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key) => {
    try {
      setLoading(true);
      setMessage("Deleting...");
      await deleteFile(idToken, key);
      setMessage("File deleted.");
      await refreshFiles();
    } catch (err) {
      console.error(err);
      setMessage("Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return <p className="dashboard-center-text">Please log in first.</p>;
  }

  const isError = message && message.toLowerCase().includes("failed");

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">File Storage Dashboard</h1>
          <p className="dashboard-subtitle">
            Secure cloud storage powered by AWS Cognito &amp; S3
          </p>
        </div>

        <div className="header-right">
          {email && (
            <div className="user-chip">
              <div className="user-avatar">{email[0].toUpperCase()}</div>
              <div className="user-info">
                <span className="user-label">Logged in as</span>
                <span className="user-email">{email}</span>
              </div>
            </div>
          )}

          <button
            className="btn danger"
            onClick={() => auth.signoutRedirect()}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="card upload-card">
          <h2>Upload a File</h2>
          <p className="card-help">
            Select a file from your device and upload it to your personal S3
            folder.
          </p>

          <form onSubmit={handleUpload} className="upload-form">
            <label className="file-input-label">
              <span>Choose File</span>
              <input
                type="file"
                onChange={(e) =>
                  setSelectedFile(e.target.files?.[0] || null)
                }
              />
            </label>

            <button
              type="submit"
              className="btn primary"
              disabled={!selectedFile || loading}
            >
              {loading ? "Please wait..." : "Upload"}
            </button>
          </form>

          {selectedFile && (
            <p className="selected-file">
              Selected: <strong>{selectedFile.name}</strong>
            </p>
          )}

          {message && (
            <p
              className={
                "status-message " + (isError ? "status-error" : "status-ok")
              }
            >
              {message}
            </p>
          )}
        </section>

        <section className="card files-card">
          <div className="files-card-header">
            <h2>My Files</h2>
            <button
              className="btn ghost"
              onClick={refreshFiles}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {loading && <p className="muted">Loading...</p>}

          {files.length === 0 && !loading && (
            <p className="muted">You haven’t uploaded any files yet.</p>
          )}

          {files.length > 0 && (
            <table className="files-table">
              <thead>
  <tr>
    <th className="col-preview">File </th>
    <th></th>
    <th className="col-actions">Actions</th>
  </tr>
</thead>
<tbody>
  {files.map((file) => (
    <tr key={file.key}>
      <td className="col-preview">
  {file.thumbnailUrl ? (
    <img
      src={file.thumbnailUrl}
      alt={file.name}
      className="file-thumb"
      onClick={() => {
        setPreviewUrl(file.thumbnailUrl);
        setPreviewName(file.name);
      }}
      style={{ cursor: "pointer" }}
    />
  ) : (
    <div className="file-thumb placeholder">–</div>
  )}
</td>
      <td
  onClick={() => {
    if (file.thumbnailUrl) {
      setPreviewUrl(file.thumbnailUrl);
      setPreviewName(file.name);
    }
  }}
  style={{ cursor: file.thumbnailUrl ? "pointer" : "default" }}
>
  {file.name}
</td>
      <td className="col-actions">
        <button
          className="btn danger"
          onClick={() => handleDelete(file.key)}
          disabled={loading}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          )}
        </section>
      </main>

      {previewUrl && (
  <div className="preview-overlay" onClick={() => setPreviewUrl(null)}>
    <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
      <img src={previewUrl} alt={previewName} />
      <button className="preview-close" onClick={() => setPreviewUrl(null)}>
        ✕
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Dashboard;
