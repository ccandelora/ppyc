import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../config/fontawesome';
import { YACHT_CLUB_ASSETS } from '../config/cloudinary';
import { Link } from 'react-router-dom';
import CloudinaryVideo from '../components/CloudinaryVideo';

function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cloudinary Video Background */}
      <div className="relative text-white">
        <div className="absolute inset-0">
          <CloudinaryVideo
            publicId={YACHT_CLUB_ASSETS.videos.heroVideo}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-slate-900 bg-opacity-70"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="mb-6">
            <FontAwesomeIcon icon={ICON_NAMES.ANCHOR} className="text-6xl text-blue-300" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            A Century of Community on the Water
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
            Welcome to the Pleasant Park Yacht Club, a second home for boaters and their families in Winthrop, Massachusetts.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Our Story Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={ICON_NAMES.SHIP} className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Story</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                For over a century, the Pleasant Park Yacht Club has been a cornerstone of the boating community 
                in Winthrop, Massachusetts. Founded in 1910 by a group of passionate sailors and boating enthusiasts, 
                our club has grown from humble beginnings to become one of the most respected yacht clubs on the East Coast.
              </p>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our waterfront location provides members with direct access to Boston Harbor and the Atlantic Ocean, 
                making it an ideal base for both recreational sailing and competitive racing. The club's facilities 
                have evolved over the decades to meet the changing needs of our membership while maintaining the 
                spirit of camaraderie and seamanship that has always defined us.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Today, PPYC is home to over 300 member families who share a passion for boating, sailing, and the 
                maritime lifestyle. Our diverse membership includes everyone from weekend sailors to Olympic competitors, 
                united by our love for the water and commitment to the club's traditions.
              </p>
            </div>
            
            <div>
              <img 
                src={YACHT_CLUB_ASSETS.gallery.marina[0]}
                alt="Historic yacht club photo"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={ICON_NAMES.CLOCK} className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our History</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4 mt-1">
                  1910
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Club Founded</h3>
                  <p className="text-gray-700">Pleasant Park Yacht Club established by a group of Boston area sailing enthusiasts seeking a permanent home for their shared passion.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4 mt-1">
                  1955
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Clubhouse Construction</h3>
                  <p className="text-gray-700">Our iconic clubhouse was built, featuring dining facilities, meeting rooms, and panoramic harbor views that still welcome members today.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4 mt-1">
                  1978
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Marina Expansion</h3>
                  <p className="text-gray-700">Major marina renovations added 100 additional slips and modern amenities, establishing PPYC as a premier boating destination.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4 mt-1">
                  2010
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Centennial Celebration</h3>
                  <p className="text-gray-700">PPYC celebrated 100 years of excellence with a year-long series of events, regatas, and community celebrations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={ICON_NAMES.FLAG} className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">What We Stand For</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={ICON_NAMES.USERS} className="text-2xl text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Camaraderie</h3>
                  <p className="text-gray-700">We foster a welcoming and inclusive atmosphere where friendships span generations.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={ICON_NAMES.COMPASS} className="text-2xl text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Seamanship</h3>
                  <p className="text-gray-700">We are committed to promoting safe boating practices, education, and a respect for the marine environment.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={ICON_NAMES.HEART} className="text-2xl text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Volunteerism</h3>
                  <p className="text-gray-700">Our club thrives because our members actively participate in its operation and improvement.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={ICON_NAMES.ANCHOR} className="text-2xl text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Tradition</h3>
                  <p className="text-gray-700">We honor our maritime heritage while embracing innovation and welcoming new generations of sailors.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={ICON_NAMES.HOME} className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Facilities</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={YACHT_CLUB_ASSETS.gallery.marina[1]}
                alt="Marina facilities"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <FontAwesomeIcon icon={ICON_NAMES.ANCHOR} className="text-xl text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-800">Full-Service Marina</h3>
                </div>
                <p className="text-gray-700">
                  200+ slips accommodating vessels up to 50 feet, with electricity, water, 
                  and pump-out services at every slip.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={YACHT_CLUB_ASSETS.gallery.events[0]}
                alt="Clubhouse dining"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <FontAwesomeIcon icon={ICON_NAMES.UTENSILS} className="text-xl text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-800">Waterfront Dining</h3>
                </div>
                <p className="text-gray-700">
                  Award-winning restaurant and bar with panoramic harbor views, 
                  serving fresh seafood and classic New England fare.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={YACHT_CLUB_ASSETS.gallery.sailing[0]}
                alt="Sailing programs"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <FontAwesomeIcon icon={ICON_NAMES.SAILBOAT} className="text-xl text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-800">Sailing Center</h3>
                </div>
                <p className="text-gray-700">
                  Professional sailing instruction, racing programs, and a fleet 
                  of club boats available for member use.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white text-center">
            <FontAwesomeIcon icon={ICON_NAMES.USERS} className="text-5xl mb-4" />
            <h2 className="text-3xl font-bold mb-4">Join Our Maritime Family</h2>
            <p className="text-xl mb-6 opacity-90">
              Experience the tradition, fellowship, and adventure that makes PPYC special.
            </p>
            <Link 
              to="/membership" 
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={ICON_NAMES.ANCHOR} />
              Learn About Membership
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage; 