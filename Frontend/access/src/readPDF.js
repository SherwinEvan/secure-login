import React, { useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import useRememberMe from "./service/rememberMe";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { MuiFileInput } from "mui-file-input";

export default function ReadPDF() {
  useRememberMe();

  const [pdfFile, setPDFFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleChange = (newFile) => {
    if (newFile && newFile.type === "application/pdf") {
      setPDFFile(newFile);
      setError(null);
    } else {
      setPDFFile(null);
      setError("Please select a PDF file.");
    }
  };

  const handleFileUpload = () => {
    if (!pdfFile) {
      setError("Please select a PDF file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const uploadedPdfUrl = reader.result;
      setPdfUrl(uploadedPdfUrl);
    };

    reader.onerror = () => {
      setError("Error reading the PDF file.");
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    reader.readAsDataURL(pdfFile);
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <NavBar />
      <div className="mb-auto">
        <MuiFileInput
          value={pdfFile}
          placeholder="Select a PDF"
          onChange={handleChange}
        />
        <Button
          type="submit"
          onClick={handleFileUpload}
          variant="contained"
          startIcon={<FileUploadIcon />}
        >
          Upload PDF
        </Button>
        {uploadProgress > 0 && (
          <LinearProgress variant="determinate" value={uploadProgress} />
        )}
        {error && <p>{error}</p>}
      </div>
      {pdfUrl && (
        <div style={{ marginTop: "20px" }}>
          <iframe src={pdfUrl} width="100%" height="600px" title="PDF Viewer" />
        </div>
      )}
      <Footer />
    </div>
  );
}
