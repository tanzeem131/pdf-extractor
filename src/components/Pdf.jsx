import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function PdfReader() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handles the file input change event.
   * Reads the selected PDF file and extracts its text content.
   */
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    // Reset states
    setText("");
    setError(null);
    setLoading(true);

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const typedarray = new Uint8Array(e.target.result);

        // Load the PDF document
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let fullText = "";

        // Iterate through each page to extract text
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          fullText += pageText + "\n";
        }

        setText(fullText);
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error extracting text from PDF:", err);
      setError("Failed to extract text from the PDF. Please try another file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>PDF Text Extractor 📄</h2>
      <p>Upload a PDF to extract its text content directly in your browser.</p>

      <input type="file" accept=".pdf" onChange={handleFileChange} />

      {loading && (
        <p style={{ color: "blue" }}>Extracting text, please wait...</p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {text && (
        <div>
          <h3>Extracted Text:</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              border: "1px solid #ccc",
              padding: "10px",
              maxHeight: "400px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
              color: "black",
            }}
          >
            {text}
          </pre>
        </div>
      )}
    </div>
  );
}

export default PdfReader;
