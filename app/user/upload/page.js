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
    await fetch('/api/finalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        file: imageUrl,
        keywordsJson,
        selectedKeywords,
      }),
    })

    // Reset everything
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
    <div className="p-6 space-y-4 max-w-md mx-auto">
      {stage === 'upload' && (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {selectedFile && (
            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Upload & Analyze
            </button>
          )}
        </>
      )}

      {stage === 'review' && imageUrl && (
        <>
          <img src={imageUrl} alt="Uploaded" className="w-full rounded" />
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
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  )
}
