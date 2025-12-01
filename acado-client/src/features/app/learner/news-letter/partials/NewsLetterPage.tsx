// NewsLetterPage.tsx
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import FeaturedArticle from '@learner/news-letter/partials/FeatureArticle';
import NewsGrid from '@features/app/learner/news-letter/NewsListPage';
import NewsHeader from '@learner/news-letter/partials/NewsHeader';
import { fetchNews } from '@services/learner/NewsServices';

export default function NewsLetterPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      try {
        const res = await fetchNews();
        setNews(res);
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, []);

  const latestArticle = news.length > 0 ? news[0] : null;

  return (
    <div className="max-w-8xl mx-auto px-4 py-8">
      <NewsHeader />
      <FeaturedArticle article={latestArticle} />
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Latest News</h2>
        </div>
        <NewsGrid news={news} loading={loading} />
      </div>
    </div>
  );
}
