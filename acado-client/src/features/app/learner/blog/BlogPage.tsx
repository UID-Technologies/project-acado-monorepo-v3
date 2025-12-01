import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlogs } from '@app/hooks/data/useBlogs';
import { Post } from '@app/types/learner/post';
import LoadingSection from '@/components/LoadingSection';
import { Input } from '@/components/ui/shadcn/input';
import Heading from '@/components/heading';
import { stripHtmlTags } from '@/utils/stripHtmlTags';

function BlogPage() {
  const [search, setSearch] = useState('');
  const { data: blogs, isLoading, isError } = useBlogs();
  const navigate = useNavigate();

  const filteredData = blogs?.filter((item) =>
    item?.title?.toLowerCase().includes(search?.toLowerCase()) ||
    item?.description?.toLowerCase().includes(search?.toLowerCase())
  ) || [];

  const gotoBlogDetails = (blogDetail: Post) => {
    navigate(`/blogDetail/${blogDetail.id}`, { state: { blogDetail } });
  };

  if (isError) return <div className="text-center text-red-500">Failed to load blogs. Please try again later.</div>;
  if (isLoading) return <LoadingSection isLoading={isLoading} title="Loading Blogs..." description='Please wait a moment' />

  return (
    <div>
      <div className='flex justify-between items-center mb-4 flex-col sm:flex-row gap-3'>
        <Heading title="Blogs" description="Explore our latest blogs and articles on various topics." className='mb-2' />
        <div>
          <Input placeholder="Search for blogs" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="group items-center mb-3 rounded transform transition-transform hover:scale-[1.02] cursor-pointer dark:bg-gray-700 bg-gray-200"
            onClick={() => gotoBlogDetails(item)}
          >
            <img
              src={item?.thumbnail_url ? item?.thumbnail_url : `https://ui-avatars.com/api/?name=${item.title}`}
              alt={`${item?.title}`}
              className="w-full rounded-t h-56 object-cover"
            />
            <div className="p-3">
              <h6 className="font-semibold capitalize dark:text-primary text-primary line-clamp-2">{item?.title}</h6>
              <div className="line-clamp-3 text-sm dark:text-gray-200">
                {stripHtmlTags(item?.description)}
              </div>
            </div>
          </div>
        ))}
        {filteredData.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center">
              <h1 className="text-primary dark:text-primary">No Blogs Found</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">No blogs found, please try again later</p>
              <Link to="/dashboard" className="btn btn-primary mt-4">Go Back</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPage;
