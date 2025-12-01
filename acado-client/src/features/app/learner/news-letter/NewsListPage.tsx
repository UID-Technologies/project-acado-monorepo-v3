// NewsGrid.tsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/shared/Loading';

export function getRelativeTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return formatDistanceToNow(date, { addSuffix: true });
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  organization_name: string;
  created_at: number;
}

interface NewsGridProps {
  news: NewsItem[];
  loading: boolean;
}

export default function NewsGrid({ news, loading }: NewsGridProps) {
  const navigate = useNavigate();

  const handleNavigate = (item: NewsItem) => {
    navigate(`/newsLetterDetail/${item.id}`, {
      state: { newsDetail: item }
    });
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news && news.length > 0 ? (
        news.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNavigate(item)}
            className="dark:bg-gray-800 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
          >
            <div className="relative dark:text-gray-800">
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="object-cover dark:text-gray-800 h-48 w-full"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2 text-sm dark:text-primary">
                <span className="capitalize">{item.organization_name}</span>
                <span className="dark:text-gray-100 capitalize">
                  • {getRelativeTime(item.created_at)}
                </span>
              </div>
              <h6 className="font-bold mb-2 line-clamp-2 text-primary dark:text-primary">
                {item.title}
              </h6>
              <div
                className="line-clamp-3 text-sm dark:text-gray-200"
                dangerouslySetInnerHTML={{
                  __html:
                    item?.description?.length > 150
                      ? item?.description?.substring(0, 150) + '...'
                      : item?.description
                }}
              ></div>
            </div>
          </div>
        ))
      ) : (
        <div>No News Letter Available</div>
      )}
    </div>
  );
}
