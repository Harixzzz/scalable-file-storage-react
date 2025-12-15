// src/components/UploadSection.jsx
import React, { useState } from "react";
import { uploadFileToS3 } from "../services/s3FileService";

export default function UploadSection({ idToken, onUploaded }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setBusy(true);
      setStatus("Uploading...");
      await uploadFileToS3(idToken, file);
      setStatus("✅ Upload success");
      setFile(null);
      onUploaded?.();
    } catch (e) {
      console.error(e);
      setStatus("❌ Upload failed (check Identity Pool + S3 CORS + IAM)");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h2>Upload a File</h2>
      <p className="muted">Select a file and upload to your personal folder in S3.</p>

      <div className="row">
        <input
          type="file"
          onChange={(e) => {
            setStatus("");
            setFile(e.target.files?.[0] || null);
          }}
        />
        <button className="btn primary" onClick={handleUpload} disabled={!file || busy}>
          {busy ? "Uploading..." : "Upload"}
        </button>
      </div>

      {status && <div className={`status ${status.includes("success") ? "ok" : status.includes("Uploading") ? "" : "bad"}`}>{status}</div>}
    </div>
  );
}
