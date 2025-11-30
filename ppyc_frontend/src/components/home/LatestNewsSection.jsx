import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../../config/fontawesome';
import { newsAPI } from '../../services/api';
import { useApiCache } from '../../hooks/useApiCache';

const LatestNewsSection = () => {
  const [news, setNews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

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
                <div 
                  className="relative bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage({ url: article.featured_image_url, title: article.title })}
                >
                  <img 
                    src={article.featured_image_url} 
                    alt={article.title}
                    className="w-full h-auto object-contain max-h-[300px] transition-transform duration-200 group-hover:scale-105"
                    style={{ maxWidth: '100%', display: 'block' }}
                  />
                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-90 rounded-full p-2">
                      <FontAwesomeIcon icon={ICON_NAMES.SEARCH} className="text-blue-600 text-lg" />
                    </div>
                  </div>
                </div>
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal/Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 rounded-full p-3 z-10 transition-all shadow-lg"
              aria-label="Close image"
            >
              <FontAwesomeIcon icon={ICON_NAMES.CLOSE} className="text-xl" />
            </button>
            
            {/* Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[90vh] object-contain mx-auto"
              />
              {/* Image Title */}
              <div className="bg-white px-6 py-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{selectedImage.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Click outside or close button to close</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LatestNewsSection; 