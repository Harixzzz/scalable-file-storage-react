// components/UploadSection.jsx
import React, { useState } from "react";

function UploadSection() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files?.[0] ?? null);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please choose a file first.");
      return;
    }

    // TODO: hook this up to real S3 upload
    console.log("Uploading file (stub):", selectedFile.name);
    alert(`(Stub) Uploading: ${selectedFile.name}`);
  };

  return (
    <section style={styles.card}>
      <h2>Upload file</h2>
      <p>Select a file and click “Upload”. Next we’ll send it to S3.</p>

      <input type="file" onChange={handleFileChange} />

      <div style={{ marginTop: "0.75rem" }}>
        <button style={styles.primaryButton} onClick={handleUpload}>
          Upload
        </button>
        {selectedFile && (
          <span style={{ marginLeft: "0.5rem", fontSize: "0.9rem" }}>
            Selected: <strong>{selectedFile.name}</strong>
          </span>
        )}
      </div>
    </section>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    backgroundColor: "#fff",
  },
  primaryButton: {
    padding: "0.4rem 0.9rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#2563EB",
    color: "#fff",
    cursor: "pointer",
  },
};

export default UploadSection;
