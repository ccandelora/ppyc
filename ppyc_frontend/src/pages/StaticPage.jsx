import React, { useState } from 'react';
import { pagesAPI } from '../services/api';
import { useApiCache } from '../hooks/useApiCache';

const StaticPage = ({ slug }) => {
  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);

  // Use cached API call for static pages
  const { data: pageData, loading: pageLoading, error: pageError } = useApiCache(
    () => pagesAPI.getBySlug(slug),
    `pages-${slug}`,
    {
      ttl: 15 * 60 * 1000, // 15 minutes cache for static pages
      enabled: !!slug, // Only fetch if slug is available
      dependencies: [slug] // Refetch when slug changes
    }
  );

  // Update data when API call completes
  React.useEffect(() => {
    if (pageData) {
      setPage(pageData.data);
    } else if (pageError) {
      setError('Page not found');
      console.error('Error fetching page:', pageError);
    }
  }, [pageData, pageError]);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-yacht-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <span className="text-white font-bold text-xl">⚓</span>
          </div>
          <p className="text-yacht-navy-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-yacht-navy-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-yacht-navy-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <a 
            href="/"
            className="btn-primary"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  const getPageIcon = (slug) => {
    switch (slug) {
      case 'about':
        return <i className="fas fa-anchor text-6xl text-white"></i>;
      case 'membership':
        return <i className="fas fa-users text-6xl text-white"></i>;
      case 'history':
        return <i className="fas fa-scroll text-6xl text-white"></i>;
      case 'marina':
      case 'marina-layout':
        return <i className="fas fa-ship text-6xl text-white"></i>;
      case 'services':
        return <i className="fas fa-cogs text-6xl text-white"></i>;
      case 'hall-rental':
        return <i className="fas fa-building text-6xl text-white"></i>;
      default:
        return <i className="fas fa-file-alt text-6xl text-white"></i>;
    }
  };

  const formatContent = (content) => {
    // Simple formatting - in a real app you might use a markdown parser
    return content?.split('\n').map((paragraph, index) => (
      paragraph.trim() ? (
        <p key={index} className="mb-4 text-slate-700 leading-relaxed">
          {paragraph}
        </p>
      ) : (
        <br key={index} />
      )
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4">{getPageIcon(slug)}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {page?.title}
          </h1>
          <p className="text-xl text-gray-300 flex items-center justify-center gap-2">
            <i className="fas fa-calendar-alt"></i>
            Pleasant Park Yacht Club - Est. 1910
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {formatContent(page?.content)}
            </div>

            {/* Call to Action based on page type */}
            {slug === 'membership' && (
              <div className="mt-12 p-8 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Ready to Join PPYC?
                </h3>
                <p className="text-slate-700 mb-6">
                  Take the next step and become part of our sailing community. 
                  Contact us today to learn more about membership opportunities.
                </p>
                <div className="space-x-4">
                  <a 
                    href="mailto:info@ppyc.org"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <i className="fas fa-envelope"></i>
                    Email Us
                  </a>
                  <a 
                    href="tel:248-555-7245"
                    className="inline-flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <i className="fas fa-phone"></i>
                    Call (248) 555-SAIL
                  </a>
                </div>
              </div>
            )}

            {slug === 'marina' || slug === 'marina-layout' && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h4 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-anchor text-blue-600"></i>
                    Marina Services
                  </h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check text-blue-600 text-sm"></i>
                      Seasonal & Transient Slips
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check text-blue-600 text-sm"></i>
                      Fuel Dock (Gas & Diesel)
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check text-blue-600 text-sm"></i>
                      Pump-out Facilities
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check text-blue-600 text-sm"></i>
                      Winter Storage
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-check text-blue-600 text-sm"></i>
                      Maintenance Services
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h4 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-user-tie text-blue-600"></i>
                    Contact Harbormaster
                  </h4>
                  <div className="space-y-3 text-slate-700">
                    <p className="flex items-center gap-2">
                      <i className="fas fa-envelope text-blue-600"></i>
                      marina@ppyc.org
                    </p>
                    <p className="flex items-center gap-2">
                      <i className="fas fa-phone text-blue-600"></i>
                      (248) 555-DOCK
                    </p>
                    <p className="flex items-center gap-2">
                      <i className="fas fa-broadcast-tower text-blue-600"></i>
                      VHF Channel 68
                    </p>
                    <p className="flex items-center gap-2">
                      <i className="fas fa-clock text-blue-600"></i>
                      Daily: 6:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>
              </div>
            )}

            {slug === 'about' && (
              <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg">
                <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-compass text-blue-600"></i>
                  Visit Us Today
                </h3>
                <p className="text-slate-700 mb-6">
                  Come experience the friendly atmosphere and rich maritime tradition 
                  that has made PPYC a cornerstone of the sailing community for over a century.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="/events" 
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <i className="fas fa-calendar-alt"></i>
                    View Events
                  </a>
                  <a 
                    href="/membership" 
                    className="inline-flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <i className="fas fa-users"></i>
                    Learn About Membership
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StaticPage; 