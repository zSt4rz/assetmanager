'use client';
import {useState} from 'react'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResponse(data.message);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Upload Image for Analysis</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setSelectedFile(file || null);
            if (file) setImageUrl(URL.createObjectURL(file));
          }}
        />
        {imageUrl && <img src={imageUrl} alt="Preview" className="w-64 h-auto" />}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload and Analyze
        </button>
      </form>
      {response && <p className="mt-4">{response}</p>}
    </main>
  );
}