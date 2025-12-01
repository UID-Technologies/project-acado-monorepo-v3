// FeaturedArticle.tsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface FeaturedArticleProps {
  article: {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    organization_name: string;
    created_at: number;
    read_time?: string;
  } | null;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  const navigate = useNavigate();

  if (!article) return null;

  const relativeTime = formatDistanceToNow(new Date(article.created_at * 1000), {
    addSuffix: true,
  });

  const handleClick = () => {
    navigate(`/newsLetterDetail/${article.id}`, {
      state: { newsDetail: article },
    });
  };

  return (
    <div
      className="bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleClick}
    >
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[16/9] md:aspect-auto">
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-4 rounded-full bg-primary" />
            <span className="text-sm text-primary">
              {article.organization_name || 'Unknown'}
            </span>
            <span className="text-sm text-gray-500 text-white">• {relativeTime}</span>
          </div>
          <h2 className="text-xl font-bold mb-2 dark:text-primary text-primary">
            {article.title}
          </h2>
          <div
            className="line-clamp-3 text-sm dark:text-gray-200"
            dangerouslySetInnerHTML={{
              __html:
                article.description.length > 250
                  ? article.description.substring(0, 250) + '...'
                  : article.description,
            }}
          ></div>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-primary">Education</span>
            <span className="text-sm text-gray-500">
              {article.read_time || '4 min read'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
