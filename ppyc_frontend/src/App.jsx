import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import AdminProtection from './components/AdminProtection';
import SEOHelmet from './components/SEOHelmet';
import { AuthProvider } from './contexts/AuthContext';

// Initialize FontAwesome icons
import './config/fontawesome';

// Development-only performance monitoring
const PerformanceMonitor = lazy(() => import('./components/PerformanceMonitor'));
const CacheDebugger = lazy(() => import('./components/admin/CacheDebugger'));

// Lazy load components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const PostDetailsPage = lazy(() => import('./pages/PostDetailsPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const MembershipPage = lazy(() => import('./pages/MembershipPage'));
const HeritagePage = lazy(() => import('./pages/HeritagePage'));
const MarinaPage = lazy(() => import('./pages/MarinaPage'));
const StaticPage = lazy(() => import('./pages/StaticPage'));
const TVDisplay = lazy(() => import('./components/TVDisplay'));

// Admin components
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const LoginForm = lazy(() => import('./components/admin/LoginForm'));
const Dashboard = lazy(() => import('./components/admin/Dashboard'));
const NewsList = lazy(() => import('./components/admin/NewsList'));
const NewsForm = lazy(() => import('./components/admin/NewsForm'));
const EventsList = lazy(() => import('./components/admin/EventsList'));
const EventForm = lazy(() => import('./components/admin/EventForm'));
const SlidesList = lazy(() => import('./components/admin/SlidesList'));
const SlideForm = lazy(() => import('./components/admin/SlideForm'));
const SlideBuilder = lazy(() => import('./components/admin/SlideBuilder'));
const MediaLibrary = lazy(() => import('./components/admin/MediaLibrary'));
const SettingsPanel = lazy(() => import('./components/admin/SettingsPanel'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <span className="text-4xl text-blue-500 mb-4 animate-spin inline-block">⌛</span>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
    // In production, you might want to send this to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <span className="text-6xl text-red-500 mb-4 block">⚠️</span>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span className="mr-2">🔄</span>
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AdminProtection />
          <SEOHelmet />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* TV Display Route - Full Screen */}
              <Route path="/tv-display" element={<TVDisplay />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<LoginForm />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                
                {/* Posts Management */}
                <Route path="news" element={<NewsList />} />
                <Route path="news/new" element={<NewsForm />} />
                <Route path="news/:id/edit" element={<NewsForm />} />
                
                {/* Events Management */}
                <Route path="events" element={<EventsList />} />
                <Route path="events/new" element={<EventForm />} />
                <Route path="events/:id/edit" element={<EventForm />} />
                
                {/* Slides Management */}
                <Route path="slides" element={<SlidesList />} />
                <Route path="slides/new" element={<SlideForm />} />
                <Route path="slides/:id/edit" element={<SlideForm />} />
                <Route path="slides/builder" element={<SlideBuilder />} />
                
                {/* Media Library */}
                <Route path="media" element={<MediaLibrary />} />
                
                {/* Settings */}
                <Route path="settings" element={<SettingsPanel />} />
              </Route>

              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="news/:slug" element={<PostDetailsPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="membership" element={<MembershipPage />} />
                <Route path="heritage" element={<HeritagePage />} />
                <Route path="marina" element={<MarinaPage />} />
                <Route path="pages/:slug" element={<StaticPage />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <span className="text-6xl text-blue-500 mb-4 block">🧭</span>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                    <p className="text-gray-600 mb-4">
                      The page you're looking for doesn't exist.
                    </p>
                    <a 
                      href="/" 
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-block"
                    >
                      <span className="mr-2">⚓</span>
                      Return Home
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
          
          {/* Performance Monitor - Development Only */}
          {import.meta.env.DEV && (
            <Suspense fallback={null}>
              <PerformanceMonitor />
              <CacheDebugger />
            </Suspense>
          )}
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
