export default function InventoryCard({ image, isExpanded, onToggle }) {
    const keywords = Object.entries(image.keywordsJson || {})
    const maxItems = 3
    const visibleKeywords = isExpanded ? keywords : keywords.slice(0, maxItems)
  
    return (
      <div className="border rounded p-4 shadow bg-white">
        <img
          src={`data:image/png;base64,${image.data}`}
          alt="Uploaded"
          className="w-full h-48 object-cover mb-2 rounded"
        />
        <p className="text-sm text-gray-600">
          Uploaded: {new Date(image.uploadedAt).toLocaleString()}
        </p>
        <h2 className="font-semibold mt-2">Items</h2>
        <ul className="list-disc pl-5">
          {visibleKeywords.map(([key, val]) => (
            <li key={key}>
              {key} (x{val})
            </li>
          ))}
        </ul>
        {keywords.length > maxItems && (
          <button
            onClick={onToggle}
            className="text-sm text-amber-700 mt-2 hover:underline"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    )
  }
  