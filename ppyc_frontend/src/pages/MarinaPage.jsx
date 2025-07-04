import React from 'react';
import { Link } from 'react-router-dom';

const MarinaPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section with Video Background */}
      <section className="relative text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/images/videos/vecteezy_similan-islands-thailand-november-23-2016-dive-boat-near_8821366.mp4" type="video/mp4" />
            <source src="/assets/images/videos/vecteezy_the-boat-is-sailing-on-the-river-a-fishing-boat-departs_53333837.mp4" type="video/mp4" />
            <source src="/assets/images/videos/vecteezy_boston-usa-october-16-2024-the-evelyn-moakley-bridge_52194493.mp4" type="video/mp4" />
            <source src="/assets/images/videos/vecteezy_fan-pier-boston-waterfront_1624405.mov" type="video/quicktime" />
            <source src="/assets/images/videos/13963117_2560_1440_30fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/85 to-blue-900/80"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-6">
            <i className="fas fa-ship text-6xl mb-6 text-blue-300"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Marina & Services
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Modern marina facilities and comprehensive services for our boating community
          </p>
        </div>
      </section>

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
                    <i className="fas fa-anchor text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Summer Marina Slip Assignments</h4>
                    <p className="text-slate-600">Secure seasonal moorage for members throughout the boating season</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-calendar-day text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Daily and Short Term Marina Slip Rentals</h4>
                    <p className="text-slate-600">Flexible rental options for visiting boaters and temporary needs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-child text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Junior Members Program</h4>
                    <p className="text-slate-600">Introducing the next generation to the joys of sailing and seamanship</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-snowflake text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Ice Always Available</h4>
                    <p className="text-slate-600">Fresh ice in 5 or 10 lb bags for your boating needs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-utensils text-blue-600 text-lg"></i>
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
                    <i className="fas fa-heart text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">"Lunch with Cindy" Sundays</h4>
                    <p className="text-slate-600">Special Sunday dining experience in the Members Lounge</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-tv text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Monday-Thursday Night Football</h4>
                    <p className="text-slate-600">Watch games and sporting events on 5 wide screen TVs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-building text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Hall Rental Available</h4>
                    <p className="text-slate-600">Event space for members, civic groups and general public</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-handshake text-blue-600 text-lg"></i>
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
                <i className="fas fa-map-marked-alt text-2xl text-blue-600 mb-3"></i>
                <h4 className="font-semibold text-slate-800 mb-2">Slip Navigation</h4>
                <p className="text-sm text-slate-600">Clear pathways and slip numbering for easy dock access</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <i className="fas fa-tools text-2xl text-blue-600 mb-3"></i>
                <h4 className="font-semibold text-slate-800 mb-2">Service Areas</h4>
                <p className="text-sm text-slate-600">Pump-out station, and maintenance facilities</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <i className="fas fa-anchor text-2xl text-blue-600 mb-3"></i>
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
                  <i className="fas fa-check-circle text-green-600 text-lg"></i>
                  <span className="text-slate-700">Floating dock systems with modern amenities</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-green-600 text-lg"></i>
                  <span className="text-slate-700">30 & 50 amp electrical service available</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-green-600 text-lg"></i>
                  <span className="text-slate-700">Fresh water connections at all slips</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-green-600 text-lg"></i>
                  <span className="text-slate-700">Pump-out station for sanitary systems</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-green-600 text-lg"></i>
                  <span className="text-slate-700">Winter storage and haul-out services</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-green-600 text-lg"></i>
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
                <i className="fas fa-user-tie text-blue-600"></i>
                Harbormaster Services
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <i className="fas fa-envelope text-blue-600"></i>
                  <div>
                    <p className="font-medium text-slate-800">Email</p>
                    <a href="mailto:marina@ppyc.org" className="text-blue-600 hover:text-blue-800">marina@ppyc.org</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-phone text-blue-600"></i>
                  <div>
                    <p className="font-medium text-slate-800">Phone</p>
                    <a href="tel:248-555-3625" className="text-blue-600 hover:text-blue-800">(248) 555-DOCK</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-broadcast-tower text-blue-600"></i>
                  <div>
                    <p className="font-medium text-slate-800">VHF Radio</p>
                    <p className="text-slate-600">Channel 68</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-clock text-blue-600"></i>
                  <div>
                    <p className="font-medium text-slate-800">Hours</p>
                    <p className="text-slate-600">Daily: 6:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <i className="fas fa-info-circle text-blue-600"></i>
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
                    <i className="fas fa-anchor"></i>
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
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Learn About Membership
              </Link>
              <Link 
                to="/events" 
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
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