import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
              <Link
                key={post.id}
                to={`/news/${post.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {post.featured_image_url && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage; 