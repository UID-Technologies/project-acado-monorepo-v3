import React, { useEffect, useState } from 'react'
import { useCommunityStore } from '@app/store/learner/communityStore'
import { fetchBlogs } from '@services/learner/BlogServices'

export function formatDateNative(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }
  return new Intl.DateTimeFormat('en-GB', options).format(date).replace(' ', '  ')
}

interface BlogPageProps {
  showHeaderAndButton?: boolean
}

export default function BlogsCard({ showHeaderAndButton = true }: BlogPageProps) {
  const { community, setCommunity } = useCommunityStore()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const getBlogList = async () => {
      try {
        const blogData = await fetchBlogs()
        setCommunity(blogData)
        console.log('community data is', blogData)
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    getBlogList()
  }, [setCommunity])

  const filteredPosts = community.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-8xl px-4 sm:px-6 lg:px-8 py-8">
      {showHeaderAndButton && (
        <div className="flex justify-between items-center mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-2xl font-semibold">Recent Blogs/Post</h2>
          <input
            type="text"
            placeholder="Search Blogs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 w-64"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mx-auto max-w-full">
        {filteredPosts.length > 0 ? (
          filteredPosts.slice(0, 4).map((post, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="relative aspect-[16/10]">
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 sm:mb-3">
                  <span className="line-clamp-1 overflow-hidden text-ellipsis text-white-800">{post.name}</span>
                  <span>•</span>
                  <span>{formatDateNative(post.created_at)}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 group-hover:text-blue-600 text-primary dark:text-primary">
                  {post.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">{post.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span key={index} className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                    {post.resource_type}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400 col-span-full">No Blogs Available</div>
        )}
      </div>

      {filteredPosts.length > 0 && (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 mx-auto w-full mt-10">
          {filteredPosts.slice(4).map((post, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-4 dark:bg-gray-700 bg-white rounded-xl overflow-hidden border border-gray-200 p-4 shadow-sm"
            >
              <div className="relative w-full sm:w-[120px] h-[120px] flex-shrink-0">
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">
                  <span className="line-clamp-1 overflow-hidden text-ellipsis dark:text-gray-100 text-white">{post.name}</span>
                  <span>•</span>
                  <span className='dark:text-gray-400'>{formatDateNative(post.created_at)}</span>
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 truncate text-primary dark:text-primary text-sm sm:text-base">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">{post.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span
                    key={post.resource_type}
                    className="px-2 py-1 rounded-full bg-white-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs sm:text-sm"
                  >
                    {post.resource_type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
