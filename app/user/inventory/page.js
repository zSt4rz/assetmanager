'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import InventoryCard from '@/app/ui/inventorycard'

export default function InventoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [images, setImages] = useState([])
  const [expandedCardId, setExpandedCardId] = useState(null) // Use unique card ID

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchInventory()
    }
  }, [status])

  async function fetchInventory() {
    try {
      const res = await fetch('/api/inventory')
      const data = await res.json()
      setImages(data.uploadedImages || [])
    } catch (err) {
      console.error('Failed to fetch inventory:', err)
    }
  }

  if (status === 'loading') return <p>Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Inventory</h1>
      {images.length === 0 ? (
        <p>No images found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, idx) => (
            <div key={idx} className="border rounded p-4 shadow bg-white">
              <img
                src={`data:image/png;base64,${image.data}`}
                alt={`Uploaded ${idx}`}
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <p className="text-sm text-gray-600">
                Uploaded: {new Date(image.uploadedAt).toLocaleString()}
              </p>
              <h2 className="font-semibold mt-2">Items</h2>
              <ul className="list-disc pl-5">
                {Object.entries(image.selectedKeywords || {}).map(([key, val]) => (
                  <li key={key}>({val})</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
