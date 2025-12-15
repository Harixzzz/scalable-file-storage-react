// src/components/FilesSection.jsx
import React, { useEffect, useState } from "react";
import { deleteFile, getDownloadUrl, listUserFiles } from "../services/s3FileService";

function formatBytes(bytes = 0) {
  const sizes = ["B", "KB", "MB", "GB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export default function FilesSection({ idToken, refreshKey }) {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setBusy(true);
      setError("");
      const items = await listUserFiles(idToken);
      setFiles(items);
    } catch (e) {
      console.error(e);
      setError("Failed to list files ❌ (check Identity Pool + IAM + S3 CORS)");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const onDelete = async (key) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      await deleteFile(idToken, key);
      await load();
    } catch (e) {
      console.error(e);
      alert("Delete failed. Check permissions.");
    }
  };

  const onDownload = async (key) => {
    try {
      const url = await getDownloadUrl(idToken, key);
      window.open(url, "_blank");
    } catch (e) {
      console.error(e);
      alert("Download failed.");
    }
  };

  return (
    <div className="card">
      <div className="cardHeader">
        <div>
          <h2>My Files</h2>
          <p className="muted">Files stored in your S3 folder.</p>
        </div>
        <button className="btn" onClick={load} disabled={busy}>
          {busy ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <div className="status bad">{error}</div>}

      {!files.length && !error ? (
        <div className="muted">No files uploaded yet.</div>
      ) : (
        <div className="table">
          {files.map((f) => (
            <div className="tr" key={f.key}>
              <div className="td fileName" title={f.key}>
                {f.key.split("/").pop()}
              </div>
              <div className="td">{formatBytes(f.size)}</div>
              <div className="td actions">
                <button className="btn small" onClick={() => onDownload(f.key)}>
                  Download
                </button>
                <button className="btn small danger" onClick={() => onDelete(f.key)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
