// components/FilesSection.jsx
import React, { useState } from "react";

function FilesSection() {
  const [files, setFiles] = useState([
    // Example stub data. Replace with real S3 data later.
    // { key: "example.txt", size: "2 KB" },
  ]);

  const handleRefresh = () => {
    // TODO: call S3 list API here
    console.log("Refreshing file list (stub)...");
    alert("(Stub) This will load your files from S3.");
  };

  const handleDelete = (key) => {
    // TODO: call S3 delete API here
    console.log("Deleting file (stub):", key);
    alert(`(Stub) Deleting: ${key}`);
    setFiles((prev) => prev.filter((f) => f.key !== key));
  };

  return (
    <section style={styles.card}>
      <h2>Your files</h2>

      <div style={{ marginBottom: "0.75rem" }}>
        <button style={styles.secondaryButton} onClick={handleRefresh}>
          Refresh list
        </button>
      </div>

      {files.length === 0 ? (
        <p>No files yet. Upload something to get started.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>File name</th>
              <th>Size</th>
              <th style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.key}>
                <td>{file.key}</td>
                <td>{file.size}</td>
                <td>
                  <button
                    style={styles.dangerButton}
                    onClick={() => handleDelete(file.key)}
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
  secondaryButton: {
    padding: "0.4rem 0.9rem",
    borderRadius: "4px",
    border: "1px solid #2563EB",
    backgroundColor: "#fff",
    color: "#2563EB",
    cursor: "pointer",
  },
  dangerButton: {
    padding: "0.3rem 0.7rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#DC2626",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default FilesSection;
