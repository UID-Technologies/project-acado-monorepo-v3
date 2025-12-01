interface ApplicationCardProps {
    category: string
    title: string
    students: number
    rating: number
    backgroundColor: string
    avatars: string[]
    isTopTen?: boolean
  }
  
  export function ApplicationCard({
    category,
    title,
    students,
    rating,
    backgroundColor,
    avatars,
    isTopTen
  }: ApplicationCardProps) {
    return (
      <div className={`${backgroundColor} rounded-3xl p-6 relative`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg text-gray-800">
            {category === 'IT & Software' && '💻'}
            {category === 'Business' && '💼'}
            {category === 'Media Training' && '▶️'}
            {category === 'Interior' && '📦'}
          </span>
          <span className="text-sm font-medium">{category}</span>
        </div>
  
        <h3 className="text-xl font-medium mb-4 pr-20 dark:text-gray-800">
          {title}
        </h3>
  
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {students.toLocaleString()} students
          </span>
          
          <div className="flex items-center gap-1">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt="Student avatar"
                className="w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0"
              />
            ))}
          </div>
        </div>
  
        <div className="absolute top-6 right-6 flex items-center gap-2">
          {isTopTen && (
            <span className="bg-yellow-400 text-xs font-medium px-2 py-1 rounded-full">
              🏆 Top 10
            </span>
          )}
          <span className="bg-white text-sm font-medium px-2 py-1 rounded-full">
            ⭐ {rating}
          </span>
        </div>
      </div>
    )
  }
  
  