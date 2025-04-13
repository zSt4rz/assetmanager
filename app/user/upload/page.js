'use client'

import { useState } from 'react'

export default function UploadAndAnalyzePage({ userId }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [keywordsJson, setKeywordsJson] = useState({})
  const [selectedKeywords, setSelectedKeywords] = useState([])
  const [stage, setStage] = useState('upload')

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setImageUrl(URL.createObjectURL(file))
  }

  const handleUpload = async () => {
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('userId', userId)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    setKeywordsJson(data.keywordsJson || {})
    setSelectedKeywords(Object.keys(data.keywordsJson || {}))
    setStage('review')
  }

  const toggleKeyword = (word) => {
    setSelectedKeywords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    )
  }

  const handleAdd = async () => {
    if (!selectedFile) return
  
    // Convert Blob to base64
    const getBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1] // Strip off data:image/...;base64,
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    }
  
    const base64 = await getBase64(selectedFile)

    await fetch('/api/finalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: base64, // ✅ Actual base64 string
        keywordsJson,
        selectedKeywords,
      }),
    })
  
    // Reset
    setSelectedFile(null)
    setImageUrl(null)
    setKeywordsJson({})
    setSelectedKeywords([])
    setStage('upload')
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setImageUrl(null)
    setKeywordsJson({})
    setSelectedKeywords([])
    setStage('upload')
  }

  return (
    <main className="h-screen bg-orange-100 text-amber-950 flex items-center justify-center">

    <div className="mt-12 p-6 space-y-4 bg-white shadow-2xl rounded-2xl">
      {stage === 'upload' && (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {selectedFile && (
            <button
              onClick={handleUpload}
              className="bg-green-900 hover:bg-green-950 hover:cursor-pointer text-white px-4 py-2 rounded-2xl"
            >
              Analyze
            </button>
          )}
        </>
      )}

      {stage === 'review' && imageUrl && (
        <>
          <img src={imageUrl} alt="Uploaded" className="h-80 rounded" />
          <h2 className="text-lg font-semibold">Detected Items</h2>
          <div className="space-y-1">
            {Object.keys(keywordsJson).map((word) => (
              <label key={word} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedKeywords.includes(word)}
                  onChange={() => toggleKeyword(word)}
                />
                <span>{word}</span>
              </label>
            ))}
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleAdd}
              className="hover:cursor-pointer bg-green-900 hover:bg-green-950 text-white px-4 py-2 rounded-2xl"
            >
              Add
            </button>
            <button
              onClick={handleCancel}
              className="hover:cursor-pointer bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-2xl"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
    </main>
  )
}
