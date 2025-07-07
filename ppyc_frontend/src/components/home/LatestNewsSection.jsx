import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { newsAPI } from '../../services/api';
import { useApiCache } from '../../hooks/useApiCache';

const LatestNewsSection = () => {
  const [news, setNews] = useState([]);

  // Use cached API call with self-managed loading
  const { data: newsData, loading: newsLoading, error: newsError } = useApiCache(
    newsAPI.getAll,
    'news-all',
    {
      ttl: 5 * 60 * 1000 // 5 minutes cache
    }
  );

  // Update data when API call completes
  useEffect(() => {
    if (newsData && newsData.data) {
      setNews(newsData.data.slice(0, 3));
    }
  }, [newsData]);

  // Don't render anything while loading
  if (newsLoading) {
    return null;
  }

  // Don't render if no news or error
  if (newsError || !news.length) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Latest News</h2>
            <div className="w-16 h-1 bg-blue-600"></div>
          </div>
          <Link 
            to="/news" 
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 transition-colors"
          >
            <span>View All News</span>
            <FontAwesomeIcon icon="arrow-right" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {news.map((article) => (
            <div key={article.id} className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              {article.featured_image_url && (
                <img 
                  src={article.featured_image_url} 
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="text-blue-600 font-semibold text-sm mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon="newspaper" />
                  {article.published_at && new Date(article.published_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{article.title}</h3>
                <p className="text-gray-600 leading-relaxed line-clamp-3">{article.content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}</p>
                <div className="mt-4">
                  <Link 
                    to={`/news/${article.slug}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    <span>Read More</span>
                    <FontAwesomeIcon icon="chevron-right" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNewsSection; 