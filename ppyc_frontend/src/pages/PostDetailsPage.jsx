import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';

const PostDetailsPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getBySlug(slug);
        setPost(response.data);
      } catch (err) {
        setError('Article not found');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content) => {
    // Simple formatting - split by paragraphs
    return content?.split('\n').map((paragraph, index) => (
      paragraph.trim() ? (
        <p key={index} className="mb-4 text-yacht-navy-700 leading-relaxed text-lg">
          {paragraph}
        </p>
      ) : (
        <br key={index} />
      )
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-yacht-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <span className="text-white font-bold text-xl">⚓</span>
          </div>
          <p className="text-yacht-navy-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-yacht-navy-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-yacht-navy-600 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <div className="space-x-4">
            <Link to="/news" className="btn-primary">
              Back to News
            </Link>
            <Link to="/" className="btn-secondary">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-yacht-navy-600">
            <Link to="/" className="hover:text-yacht-blue-600 transition-colors">
              Home
            </Link>
            <span>›</span>
            <Link to="/news" className="hover:text-yacht-blue-600 transition-colors">
              News
            </Link>
            <span>›</span>
            <span className="text-yacht-navy-900 font-medium">
              {post?.title}
            </span>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Featured Image */}
            {post?.featured_image_url && (
              <div className="w-full h-96 overflow-hidden">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              {/* Article Meta */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
                <div className="flex items-center space-x-4 text-sm text-yacht-navy-500">
                  <span className="flex items-center">
                    <span className="mr-2">📅</span>
                    {formatDate(post?.published_at)}
                  </span>
                  <span className="flex items-center">
                    <span className="mr-2">✍️</span>
                    {post?.author?.email || 'PPYC Staff'}
                  </span>
                </div>
                
                {/* Share buttons */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-yacht-navy-500 mr-2">Share:</span>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: post?.title,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="p-2 text-yacht-navy-400 hover:text-yacht-blue-600 transition-colors"
                    title="Share article"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Article Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-yacht-navy-900 mb-8 leading-tight">
                {post?.title}
              </h1>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {formatContent(post?.content)}
              </div>

              {/* Tags or Categories (if we had them) */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-yacht-navy-500">Topics:</span>
                  <span className="px-3 py-1 bg-yacht-blue-100 text-yacht-blue-800 text-sm rounded-full">
                    Club News
                  </span>
                  <span className="px-3 py-1 bg-yacht-blue-100 text-yacht-blue-800 text-sm rounded-full">
                    PPYC
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center">
            <Link
              to="/news"
              className="inline-flex items-center text-yacht-blue-600 hover:text-yacht-blue-700 font-medium transition-colors"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to All News
            </Link>

            <div className="text-sm text-yacht-navy-500">
              <Link to="/events" className="hover:text-yacht-blue-600 transition-colors">
                View Upcoming Events
              </Link>
            </div>
          </div>

          {/* Contact/Engagement Section */}
          <div className="mt-16 bg-yacht-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-serif font-bold text-yacht-navy-900 mb-4">
              Stay Informed
            </h3>
            <p className="text-yacht-navy-700 mb-6">
              Don't miss out on the latest club news, events, and announcements. 
              Connect with us to stay in the loop.
            </p>
            <div className="space-x-4">
              <a 
                href="mailto:info@ppyc.org"
                className="btn-primary"
              >
                Contact Club Office
              </a>
              <Link 
                to="/membership"
                className="btn-secondary"
              >
                Learn About Membership
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetailsPage; 