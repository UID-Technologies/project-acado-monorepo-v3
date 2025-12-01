import React, { } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useBlogs } from '@app/hooks/data/useBlogs'
import { Post } from "@app/types/learner/post";
import LoadingSection from '@/components/LoadingSection';

function BlogPage() {

    const navigate = useNavigate()
    const { data: blogs = [], isLoading, isError } = useBlogs()

    if (isLoading) return <LoadingSection isLoading={isLoading} title="Loading Blogs..." description='Please wait a moment' />

    const gotoBlogDetails = (item: Post) => {
        navigate(`/blogDetail/${item.id}`, { state: { blogDetail: item } })
    }

    if (isError) return <div className='bg-white dark:bg-gray-800 p-4 rounded-lg mb-3'>Failed to load blogs</div>

    if (!blogs || blogs.length === 0) return null;

    return (
        <div className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-3'>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-primary dark:text-primary">Blogs</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Stay Updated With Our Blogs
                    </p>
                </div>
                <div className="">
                    <Link to="/blogs" className="text-primary dark:text-primary">
                        View All
                    </Link>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                {blogs && blogs.length > 0 && blogs.map((item, index) => (
                    index < 3 &&
                    <div
                        key={item.id}
                        className='group block md:flex items-center mb-3 rounded transform transition-transform hover:scale-[1.02] cursor-pointer dark:bg-gray-700 bg-white shadow-md'>
                        <div className='w-full h-48 md:w-48 md:min-w-48 md:h-28 md:h-min-28 bg-cover bg-center rounded-t md:rounded-l md:rounded-r-none bg-cover bg-center overflow-hidden'
                            onClick={() => gotoBlogDetails(item)}
                        >
                            <img src={item.thumbnail_url ? item.thumbnail_url : `https://ui-avatars.com/api/?name=${item?.title}`} alt={item?.title} />
                        </div>
                        <div className='px-3 py-3 md:py-0'>
                            <h6 className='font-semibold capitalize dark:text-primary text-primary'>{
                                item?.title?.length > 60 ? item?.title.substring(0, 60) + '...' : item?.title
                            }</h6>
                            <div className="text-sm dark:text-gray-200" dangerouslySetInnerHTML={{
                                __html: item?.description?.length > 130 ? item?.description.substring(0, 130) + '...' : item?.description
                            }}></div>
                            {/* user_liked */}
                            <div className="flex items-center gap-2 py-1">
                                {/* <div className="flex items-center gap-1">
                                    <BiLike size={16} className='text-primary' />
                                    <span>{item?.user_liked}</span>
                                </div> */}
                                {/* view_count */}
                                {/* <div className="flex items-center gap-1 ml-2">
                                    <Eye size={16} className='text-primary' />
                                    <span>{item?.view_count}</span>
                                    <span>views</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                )
                )}
            </div>

        </div>
    )
}

export default BlogPage
