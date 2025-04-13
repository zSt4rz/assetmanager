'use client'

import { useState, useEffect } from 'react'
export default function Page() {

  const [selectedFile, setSelectedFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [response, setResponse] = useState("")

  // // Return Blank HTML element while loading
  // if (status === 'loading') return <p>Loading...</p>
  // if (!session) return null // Retrun so the page doesn't load if user isn't logged In

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) return

    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("userId", session.user.id)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    setResponse(data.message)
  }

  return (
    <main className="h-screen text-gray-200 bg-orange-100 flex flex-col items-center justify-center p-6">
        <div className="py-10 gap-y-4 flex flex-col items-center w-[80%] h-[70%] bg-gray-200 shadow-xl rounded-2xl shadow-gray-700">
            <img src={imageUrl} className="w-64 h-auto"/>
            <form onSubmit={handleSubmit}>
                <input className="w-64 px-1 py-2 bg-green-950 hover:bg-green-900 rounded-2xl"
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    setSelectedFile(file || null);
                    if (file) setImageUrl(URL.createObjectURL(file));
                }}
                />
                <button type="submit" className="bg-green-950 hover:bg-green-900 px-4 py-2 rounded-2xl">Analyze Photo</button>
            </form>
        </div>
      
      {response && <p className="mt-4">{response}</p>}
    </main>
  );
}