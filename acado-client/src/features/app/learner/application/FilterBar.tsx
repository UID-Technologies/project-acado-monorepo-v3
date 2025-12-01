const categories = [
    { id: 'all', name: 'All', icon: '⋮⋮' },
    { id: 'it', name: 'IT & Software', icon: '💻' },
    { id: 'media', name: 'Media Training', icon: '▶️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'interior', name: 'Interior', icon: '📦' },
  ]
  
  export function FilterBar() {
    return (
      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => (
          <button
            key={category.id}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full
              ${index === 0 ? 'bg-black text-white' : 'bg-[#f5f5f5] text-black hover:bg-gray-200'}
              transition-colors duration-200
            `}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    )
  }
  
  