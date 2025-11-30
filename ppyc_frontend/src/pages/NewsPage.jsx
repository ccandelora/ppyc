import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../config/fontawesome';
import SEOHelmet from '../components/SEOHelmet';
import { YACHT_CLUB_ASSETS } from '../config/cloudinary';
import CloudinaryVideo from '../components/CloudinaryVideo';
import { newsAPI } from '../services/api';

const generateExcerpt = (content, maxLength = 150) => {
  if (!content) return '';
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  // Truncate to maxLength and add ellipsis if needed
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const NewsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await newsAPI.getAll();
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError(`Failed to load news posts: ${err.message}`);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title="News - Pleasant Park Yacht Club"
        description="Stay updated with the latest news, events, and announcements from Pleasant Park Yacht Club."
      />

      {/* Hero Section with Video Background */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <CloudinaryVideo
            publicId={YACHT_CLUB_ASSETS.videos.harborView}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Club News & Updates
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Stay informed about the latest happenings at Pleasant Park Yacht Club.
            </p>
          </div>
        </div>
      </div>

      {/* News Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {loading ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={ICON_NAMES.LOADING} spin className="text-4xl text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <FontAwesomeIcon icon={ICON_NAMES.WARNING} className="text-4xl mb-4" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {post.featured_image_url && (
                  <div 
                    className="relative bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedImage({ url: post.featured_image_url, title: post.title })}
                  >
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
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
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{generateExcerpt(post.content)}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} className="mr-2" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
    </div>
  );
};

export default NewsPage; 