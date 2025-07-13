import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../config/fontawesome';
import SEOHelmet from '../components/SEOHelmet';
import { YACHT_CLUB_ASSETS } from '../config/cloudinary';
import CloudinaryVideo from '../components/CloudinaryVideo';

const MarinaPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title="Marina - Pleasant Park Yacht Club"
        description="Explore our state-of-the-art marina facilities at Pleasant Park Yacht Club. Safe harbor, modern amenities, and exceptional service."
      />

      {/* Hero Section with Video Background */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <CloudinaryVideo
            publicId={YACHT_CLUB_ASSETS.videos.diveBoat}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Our Marina
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Experience world-class facilities and services in our protected harbor.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Services Overview */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Marina Services & Amenities
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              PPYC offers a wide variety of services to its members. Listed below are a few of the most popular services and events happening on a daily basis.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">
              Among the many benefits of membership, we're proud to offer:
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={ICON_NAMES.ANCHOR} className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Summer Marina Slip Assignments</h4>
                    <p className="text-slate-600">Secure seasonal moorage for members throughout the boating season</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Daily and Short Term Marina Slip Rentals</h4>
                    <p className="text-slate-600">Flexible rental options for visiting boaters and temporary needs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={ICON_NAMES.USERS} className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Junior Members Program</h4>
                    <p className="text-slate-600">Introducing the next generation to the joys of sailing and seamanship</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={ICON_NAMES.WATER} className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Ice Always Available</h4>
                    <p className="text-slate-600">Fresh ice in 5 or 10 lb bags for your boating needs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={ICON_NAMES.UTENSILS} className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Full Bar and Grill ALL YEAR</h4>
                    <p className="text-slate-600">Open Noon to 1 AM, 7 days a week for your dining and entertainment</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={ICON_NAMES.HEART} className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">"Lunch with Cindy" Sundays</h4>
                    <p className="text-slate-600">Special Sunday dining experience in the Members Lounge</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={ICON_NAMES.TV} className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Monday-Thursday Night Football</h4>
                    <p className="text-slate-600">Watch games and sporting events on 5 wide screen TVs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={ICON_NAMES.HOME} className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Hall Rental Available</h4>
                    <p className="text-slate-600">Event space for members, civic groups and general public</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={ICON_NAMES.USERS} className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Weekend Invasions</h4>
                    <p className="text-slate-600">Summer boating season invasions both home & away with sister yacht clubs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Official Marina Layout */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Official Marina Layout</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our detailed marina layout shows slip assignments, facilities, and navigation paths for easy dock access.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="text-center mb-8">
              <img 
                src="/assets/images/ppyc-images/ppyc-marina-layout.png" 
                alt="PPYC Marina Layout Diagram" 
                className="w-full max-w-4xl mx-auto rounded-xl shadow-lg border border-gray-200"
              />
              <p className="text-sm text-gray-500 text-center mt-4 italic">
                Official PPYC Marina Layout - Slip assignments, facilities, and navigation paths
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex flex-col items-center">
                  <FontAwesomeIcon icon={ICON_NAMES.COMPASS} className="text-2xl text-blue-600 mb-3" />
                  <h4 className="font-semibold text-slate-800 mb-2">Slip Navigation</h4>
                  <p className="text-sm text-slate-600">Clear pathways and slip numbering for easy dock access</p>
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FontAwesomeIcon icon={ICON_NAMES.SHIELD} className="text-2xl text-blue-600 mb-3" />
                <h4 className="font-semibold text-slate-800 mb-2">Service Areas</h4>
                <p className="text-sm text-slate-600">Pump-out station, and maintenance facilities</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FontAwesomeIcon icon={ICON_NAMES.ANCHOR} className="text-2xl text-blue-600 mb-3" />
                <h4 className="font-semibold text-slate-800 mb-2">Mooring Options</h4>
                <p className="text-sm text-slate-600">Seasonal and transient slips for vessels of all sizes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Marina Facilities */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Marina Facilities</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <img 
                src="/assets/images/ppyc-images/dockal.jpg" 
                alt="PPYC Marina Dock Facilities" 
                className="w-full rounded-xl shadow-lg"
              />
              <p className="text-sm text-gray-500 text-center mt-3 italic">
                Modern floating dock systems and marina infrastructure
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Modern Marina Amenities</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={ICON_NAMES.CHECK_CIRCLE} className="text-green-600 text-lg" />
                  <span className="text-slate-700">Floating dock systems with modern amenities</span>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={ICON_NAMES.CHECK_CIRCLE} className="text-green-600 text-lg" />
                  <span className="text-slate-700">30 & 50 amp electrical service available</span>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={ICON_NAMES.CHECK_CIRCLE} className="text-green-600 text-lg" />
                  <span className="text-slate-700">Fresh water connections at all slips</span>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={ICON_NAMES.CHECK_CIRCLE} className="text-green-600 text-lg" />
                  <span className="text-slate-700">Pump-out station for sanitary systems</span>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={ICON_NAMES.CHECK_CIRCLE} className="text-green-600 text-lg" />
                  <span className="text-slate-700">Winter storage and haul-out services</span>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={ICON_NAMES.CHECK_CIRCLE} className="text-green-600 text-lg" />
                  <span className="text-slate-700">24/7 security and monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marina Life Gallery */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Life at the Marina</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-slate-600">Experience the vibrant marina community at Pleasant Park Yacht Club</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="group">
              <img 
                src="/assets/images/ppyc-images/float.jpg" 
                alt="Marina floating docks" 
                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              />
              <p className="text-sm text-center text-slate-600 mt-2">Floating Dock System</p>
            </div>
            <div className="group">
              <img 
                src="/assets/images/ppyc-images/dinghy.jpg" 
                alt="Boats at the marina" 
                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              />
              <p className="text-sm text-center text-slate-600 mt-2">Boat Moorage</p>
            </div>
            <div className="group">
              <img 
                src="/assets/images/ppyc-images/deck.jpg" 
                alt="Club deck area" 
                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              />
              <p className="text-sm text-center text-slate-600 mt-2">Club Deck</p>
            </div>
            <div className="group">
              <img 
                src="/assets/images/ppyc-images/sunset.jpg" 
                alt="Marina sunset views" 
                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              />
              <p className="text-sm text-center text-slate-600 mt-2">Sunset Views</p>
            </div>
          </div>
        </section>

        {/* Contact & Information */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <FontAwesomeIcon icon={ICON_NAMES.USER} className="text-blue-600" />
                Harbormaster Services
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={ICON_NAMES.ENVELOPE} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-800">Email</p>
                    <a href="mailto:marina@ppyc.org" className="text-blue-600 hover:text-blue-800">marina@ppyc.org</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={ICON_NAMES.PHONE} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-800">Phone</p>
                    <a href="tel:248-555-3625" className="text-blue-600 hover:text-blue-800">(248) 555-DOCK</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={ICON_NAMES.BROADCAST} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-800">VHF Radio</p>
                    <p className="text-slate-600">Channel 68</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={ICON_NAMES.CLOCK} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-800">Hours</p>
                    <p className="text-slate-600">Daily: 6:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <FontAwesomeIcon icon={ICON_NAMES.INFO} className="text-blue-600" />
                Slip Reservations
              </h3>
              <div className="space-y-4 text-slate-700">
                <p>
                  <strong>Seasonal Slips:</strong> Available to members on annual basis. Applications accepted starting February 1st.
                </p>
                <p>
                  <strong>Transient Slips:</strong> Daily and weekly rentals available for visiting boats. Advance reservations recommended.
                </p>
                <p>
                  <strong>Guest Privileges:</strong> Members may sponsor guest boats for short-term stays.
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <Link 
                    to="/membership" 
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
                  >
                    <FontAwesomeIcon icon={ICON_NAMES.ANCHOR} />
                    Learn About Membership
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Marina Community?
            </h2>
            <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Experience world-class marina facilities, exceptional service, and a welcoming community 
              of fellow boating enthusiasts at Pleasant Park Yacht Club.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/membership" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                <FontAwesomeIcon icon={ICON_NAMES.ANCHOR} />
                Learn About Membership
              </Link>
              <Link 
                to="/events" 
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                <FontAwesomeIcon icon={ICON_NAMES.CALENDAR} />
                View Upcoming Events
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default MarinaPage; 