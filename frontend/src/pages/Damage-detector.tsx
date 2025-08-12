import React, { useState } from "react";
import { Package } from "lucide-react";

const DamageChecker: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setResult(null);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  // Upload file to backend and get prediction
  const handleCheckDamage = async () => {
    if (!file) return alert("Please select an image or video");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/detect-damage", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        setResult("Error: " + data.error);
      } else if (data.message) {
        setResult(data.message);
      } else {
        setResult("No result");
      }
    } catch (error) {
      setResult("Failed to fetch result");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-300 text-center">
      <Package className="h-20 w-20 text-green-500 mx-auto mb-6 animate-pulse" />
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
        Product Damage Checker
      </h2>

      <label
        htmlFor="file-upload"
        className="block cursor-pointer mx-auto mb-6 max-w-xs rounded-lg border-2 border-dashed border-green-400 px-4 py-8 text-green-600 hover:bg-green-50 transition-colors font-medium"
      >
        {file ? (
          <span>{file.name}</span>
        ) : (
          <span>Click to select an image or video</span>
        )}
        <input
          id="file-upload"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {preview && (
        <div className="mb-6">
          {file?.type.startsWith("video") ? (
            <video
              src={preview}
              controls
              className="mx-auto max-h-64 rounded-xl shadow-md border border-green-200"
            />
          ) : (
            <img
              src={preview}
              alt="preview"
              className="mx-auto max-h-64 rounded-xl shadow-md border border-green-200"
            />
          )}
        </div>
      )}

      <button
        disabled={loading}
        onClick={handleCheckDamage}
        className="bg-green-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 transition"
      >
        {loading ? "Checking..." : "Check Damage"}
      </button>

      {result && (
        <div className="mt-8 p-4 max-w-xs mx-auto bg-green-50 border border-green-300 rounded-lg text-green-800 font-semibold shadow-inner">
          {result}
        </div>
      )}
    </div>
  );
};

export default DamageChecker;
