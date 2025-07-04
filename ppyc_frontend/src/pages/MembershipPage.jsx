import React from 'react';
import { Link } from 'react-router-dom';

const MembershipPage = () => {
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
            poster="/assets/images/ppyc-images/ppyc-hero.png"
            className="w-full h-full object-cover"
          >
            <source src="/assets/images/videos/vecteezy_boston-usa-october-16-2024-the-evelyn-moakley-bridge_52194493.mp4" type="video/mp4" />
            <source src="/assets/images/videos/vecteezy_fan-pier-boston-waterfront_1624405.mov" type="video/quicktime" />
            <source src="/assets/images/videos/13963117_2560_1440_30fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/85 to-blue-900/80"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-6">
            <i className="fas fa-users text-6xl mb-6 text-blue-300"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Join Our Crew
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-8">
            Experience over a century of maritime tradition, exceptional facilities, and a welcoming community of fellow boating enthusiasts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/assets/images/docs/PPYC_APPLICATION.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <i className="fas fa-file-pdf mr-2"></i>
              Download Application
            </a>
            <a 
              href="#benefits" 
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Why Join PPYC */}
        <section id="benefits" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Why Choose Pleasant Park Yacht Club?
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Founded in 1910, PPYC has been fostering maritime excellence and community spirit for over a century. 
              Join a tradition of seamanship, friendship, and unforgettable experiences on the water.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-ship text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Premier Marina</h3>
              <p className="text-slate-600 leading-relaxed">
                Modern floating dock systems, seasonal slip assignments, and comprehensive marina services including maintenance, winter storage, and 24/7 security.
              </p>
            </div>

            <div className="text-center bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-handshake text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Vibrant Community</h3>
              <p className="text-slate-600 leading-relaxed">
                Connect with fellow boating enthusiasts through weekend invasions with sister yacht clubs, social events, and our welcoming clubhouse atmosphere.
              </p>
            </div>

            <div className="text-center bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-utensils text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Year-Round Amenities</h3>
              <p className="text-slate-600 leading-relaxed">
                Full bar and grill open noon to 1 AM daily, Sunday "Lunch with Cindy", sports viewing on 5 wide-screen TVs, and event hall rentals.
              </p>
            </div>
          </div>
        </section>

        {/* Membership Benefits */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Member Benefits & Services</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <i className="fas fa-anchor text-blue-600"></i>
                  Marina & Boating
                </h3>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-check text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Summer Marina Slip Assignments</h4>
                    <p className="text-slate-600 text-sm">Priority seasonal moorage for the entire boating season</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-check text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Transient Guest Privileges</h4>
                    <p className="text-slate-600 text-sm">Daily and weekly slip rentals for visiting friends and family</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-check text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Modern Marina Facilities</h4>
                    <p className="text-slate-600 text-sm">30 & 50 amp electrical, fresh water, pump-out station, winter storage</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-check text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Maintenance Services</h4>
                    <p className="text-slate-600 text-sm">Professional boat maintenance and repair services on-site</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <i className="fas fa-heart text-blue-600"></i>
                  Social & Dining
                </h3>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-check text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Full Bar & Grill</h4>
                    <p className="text-slate-600 text-sm">Open noon to 1 AM, 7 days a week year-round</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-check text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Special Dining Events</h4>
                    <p className="text-slate-600 text-sm">Sunday "Lunch with Cindy" and exclusive member dining experiences</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-check text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Sports & Entertainment</h4>
                    <p className="text-slate-600 text-sm">Monday-Thursday Night Football on 5 wide-screen TVs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-check text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Event Hall Rental</h4>
                    <p className="text-slate-600 text-sm">Private event space for celebrations and gatherings</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <i className="fas fa-child text-2xl text-blue-600 mb-2"></i>
                  <h4 className="font-semibold text-slate-800 text-sm">Junior Members Program</h4>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <i className="fas fa-snowflake text-2xl text-blue-600 mb-2"></i>
                  <h4 className="font-semibold text-slate-800 text-sm">Ice Always Available</h4>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <i className="fas fa-handshake text-2xl text-blue-600 mb-2"></i>
                  <h4 className="font-semibold text-slate-800 text-sm">Sister Club Invasions</h4>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <i className="fas fa-shield-alt text-2xl text-blue-600 mb-2"></i>
                  <h4 className="font-semibold text-slate-800 text-sm">24/7 Security</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to Join?</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Becoming a member of Pleasant Park Yacht Club is easy! Follow these simple steps to start your journey with us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center bg-white rounded-xl shadow-lg p-6">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Download Application</h3>
              <p className="text-slate-600 mb-4">
                Get our membership application form and review all the details about joining PPYC.
              </p>
              <a 
                href="/assets/images/docs/PPYC_APPLICATION.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <i className="fas fa-download"></i>
                Download PDF
              </a>
            </div>

            <div className="text-center bg-white rounded-xl shadow-lg p-6">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Complete & Submit</h3>
              <p className="text-slate-600 mb-4">
                Fill out the application completely and submit it along with any required documentation.
              </p>
              <div className="text-slate-500 text-sm">
                Mail or deliver in person to the club
              </div>
            </div>

            <div className="text-center bg-white rounded-xl shadow-lg p-6">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Welcome Aboard!</h3>
              <p className="text-slate-600 mb-4">
                Once approved, you'll receive your welcome packet and can start enjoying all member benefits.
              </p>
              <div className="text-slate-500 text-sm">
                Membership committee review
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our membership committee is here to help you through the process. 
              Don't hesitate to reach out with any questions about joining PPYC.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:membership@ppyc.org" 
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-envelope"></i>
                membership@ppyc.org
              </a>
              <a 
                href="tel:248-555-7245" 
                className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
              >
                <i className="fas fa-phone"></i>
                (248) 555-SAIL
              </a>
            </div>
          </div>
        </section>

        {/* Member Testimonials / Community Photos */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Life at PPYC</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-slate-600">Experience the camaraderie and adventure that awaits you</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="group">
              <img 
                src="/assets/images/ppyc-images/party1.jpg" 
                alt="Club social events" 
                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              />
              <p className="text-sm text-center text-slate-600 mt-2">Social Events</p>
            </div>
            <div className="group">
              <img 
                src="/assets/images/ppyc-images/matches.jpg" 
                alt="Sailing and racing" 
                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              />
              <p className="text-sm text-center text-slate-600 mt-2">Racing Program</p>
            </div>
            <div className="group">
              <img 
                src="/assets/images/ppyc-images/deck.jpg" 
                alt="Club facilities" 
                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              />
              <p className="text-sm text-center text-slate-600 mt-2">Beautiful Facilities</p>
            </div>
            <div className="group">
              <img 
                src="/assets/images/ppyc-images/sunset.jpg" 
                alt="Marina sunsets" 
                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              />
              <p className="text-sm text-center text-slate-600 mt-2">Scenic Location</p>
            </div>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="text-center">
          <div className="bg-slate-900 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Adventure Today</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join over a century of maritime tradition, make lifelong friendships, and create unforgettable memories on the water. 
              Your adventure at Pleasant Park Yacht Club starts with a simple application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/assets/images/docs/PPYC_APPLICATION.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                <i className="fas fa-file-pdf mr-2"></i>
                Get Application Form
              </a>
              <Link 
                to="/marina" 
                className="px-8 py-4 border-2 border-blue-400 text-blue-400 font-semibold rounded-lg hover:bg-blue-400 hover:text-white transition-all duration-300"
              >
                Tour Our Marina
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default MembershipPage; 