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
    <main className="min-h-screen bg-orange-100 text-amber-950">
      <div className="pt-24 px-6">
        <h1 className="text-2xl font-bold mb-4">Your Inventory</h1>
        {images.length === 0 ? (
          <p>No images found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => {
              const cardId = image.uploadedAt // Use unique identifier
              return (
                <InventoryCard
                  key={cardId}
                  image={image}
                  isExpanded={expandedCardId === cardId}
                  onToggle={() =>
                    setExpandedCardId(expandedCardId === cardId ? null : cardId)
                  }
                />
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
