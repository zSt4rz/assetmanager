'use client'

import { useState } from 'react'

export default function UploadAndAnalyzePage({ userId }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [keywordsJson, setKeywordsJson] = useState({})
  const [selectedKeywords, setSelectedKeywords] = useState({})
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
    setSelectedKeywords(
      Object.keys(data.keywordsJson || {}).reduce((acc, key) => {
        acc[key] = data.keywordsJson[key]
        return acc
      }, {})
    )
    setStage('review')
  }

  const updateValue = (word, value) => {
    const numValue = Number(value)
    setKeywordsJson((prev) => ({ ...prev, [word]: numValue }))
    setSelectedKeywords((prev) =>
      prev[word] !== undefined ? { ...prev, [word]: numValue } : prev
    )
  }
  const toggleKeyword = (word) => {
    setSelectedKeywords((prev) => {
      const newSelected = { ...prev }
      if (newSelected[word] !== undefined) {
        delete newSelected[word]
      } else {
        newSelected[word] = keywordsJson[word] ?? 0
      }
      return newSelected
    })
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
    <main className="h-screen bg-orange-100 text-amber-950 flex items-center justify-center overflow-hidden">
      <div className="mt-12 p-6 bg-white shadow-2xl rounded-2xl max-h-[90vh] w-full max-w-5xl overflow-hidden">
        {stage === 'upload' && (
          <div className="space-y-4">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {selectedFile && (
              <button
                onClick={handleUpload}
                className="bg-green-900 hover:bg-green-950 hover:cursor-pointer text-white px-4 py-2 rounded-2xl"
              >
                Analyze
              </button>
            )}
          </div>
        )}
  
        {stage === 'review' && imageUrl && (
          <div className="flex flex-col lg:flex-row gap-6 max-h-[70vh]">
            {/* Left: Image */}
            <div className="flex-1">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-full h-auto max-h-[70vh] object-contain rounded"
              />
            </div>
  
            {/* Right: Scrollable keyword panel */}
            <div className="flex-1 flex flex-col max-h-[70vh]">
              <h2 className="text-lg font-semibold mb-2">Detected Items</h2>
              <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                {Object.keys(keywordsJson).map((word) => (
                  <label key={word} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedKeywords[word] !== undefined}
                      onChange={() => toggleKeyword(word)}
                    />
                    <span className="flex-1">{word}</span>
                    <input
                      type="number"
                      value={keywordsJson[word] ?? 0}
                      onChange={(e) => updateValue(word, e.target.value)}
                      className="border p-1 rounded w-20 text-right"
                    />
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
            </div>
          </div>
        )}
      </div>
    </main>
  )
  
}
