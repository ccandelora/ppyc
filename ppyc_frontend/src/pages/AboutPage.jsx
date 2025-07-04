import React from 'react';

function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Video Background */}
      <div className="relative text-white">
        <div className="absolute inset-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/images/videos/vecteezy_similan-islands-thailand-november-23-2016-dive-boat-near_8821366.mp4" type="video/mp4" />
            <source src="/assets/images/videos/13974154_3840_2160_50fps.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-slate-900 bg-opacity-70"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-24">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            A Century of Community on the Water
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
            Welcome to the Pleasant Park Yacht Club, a second home for boaters and their families in Winthrop, Massachusetts.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Introduction */}
        <div className="mb-16">
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            For over a century, we've been more than just a place to moor a boat; we are a vibrant, member-driven community built on a shared love for the sea, lasting friendships, and the spirit of volunteerism.
          </p>
        </div>

        {/* History Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
                <i className="fas fa-anchor text-blue-600 mr-3"></i>
                Our Enduring History
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our story began in <strong>1910</strong> as the "Pleasant Park Canoe Club," a gathering place for enthusiasts of paddle sports. As the years passed and our members' interests evolved, so did we. Embracing the growing popularity of sailing and powerboating, we became the Pleasant Park Yacht Club, expanding our facilities and our mission.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Through all the changes, the heart of the club has remained the same: a place where members work together and play together. The docks we use, the launches we ride, and the clubhouse we enjoy are all maintained by the hard work and dedication of our members, fostering a unique sense of pride and ownership.
              </p>
            </div>
            <div className="space-y-4">
              <img 
                src="/assets/images/ppyc-images/ppyc-1919a-768x603.jpg" 
                alt="PPYC in 1919" 
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-sm text-gray-500 text-center italic">PPYC in 1919 - Our early days</p>
            </div>
          </div>

          {/* Historical Timeline */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <img 
                src="/assets/images/ppyc-images/ppyc1920a-768x518.jpg" 
                alt="PPYC 1920" 
                className="w-full h-48 object-cover rounded-lg shadow-md mb-4"
              />
              <h3 className="font-bold text-slate-800 mb-2">1920s</h3>
              <p className="text-gray-600 text-sm">Expanding our facilities and membership</p>
            </div>
            <div className="text-center">
              <img 
                src="/assets/images/ppyc-images/ppyc1951_men_at_bar-768x563.jpg" 
                alt="PPYC 1951" 
                className="w-full h-48 object-cover rounded-lg shadow-md mb-4"
              />
              <h3 className="font-bold text-slate-800 mb-2">1950s</h3>
              <p className="text-gray-600 text-sm">Building lasting friendships and traditions</p>
            </div>
            <div className="text-center">
              <img 
                src="/assets/images/ppyc-images/ppyc-small-boat.jpg" 
                alt="Modern PPYC" 
                className="w-full h-48 object-cover rounded-lg shadow-md mb-4"
              />
              <h3 className="font-bold text-slate-800 mb-2">Today</h3>
              <p className="text-gray-600 text-sm">Continuing our legacy on the water</p>
            </div>
          </div>
        </section>

        {/* Current Experience Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <img 
                src="/assets/images/ppyc-images/sunset.jpg" 
                alt="Beautiful sunset at PPYC" 
                className="w-full rounded-lg shadow-lg"
              />
              <img 
                src="/assets/images/ppyc-images/party1.jpg" 
                alt="Club gathering" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
                <i className="fas fa-compass text-blue-600 mr-3"></i>
                The PPYC Experience Today
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Nestled in a protected cove with breathtaking views and easy access to Boston Harbor, PPYC is a true gem. Our members enjoy a full season of activities, both on and off the water. From competitive and casual racing to family cookouts on the deck, there's always something happening.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our club is for everyone—sailors, powerboaters, and social members alike are all part of the PPYC family.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center flex items-center justify-center">
            <i className="fas fa-trophy text-blue-600 mr-3"></i>
            What We Stand For
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start">
                <i className="fas fa-users text-blue-600 text-2xl mr-4 mt-1"></i>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Camaraderie</h3>
                  <p className="text-gray-700">We foster a welcoming and inclusive atmosphere where friendships span generations.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start">
                <i className="fas fa-ship text-blue-600 text-2xl mr-4 mt-1"></i>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Seamanship</h3>
                  <p className="text-gray-700">We are committed to promoting safe boating practices, education, and a respect for the marine environment.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start">
                <i className="fas fa-hands-helping text-blue-600 text-2xl mr-4 mt-1"></i>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Volunteerism</h3>
                  <p className="text-gray-700">Our club thrives because our members actively participate in its operation and improvement.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start">
                <i className="fas fa-scroll text-blue-600 text-2xl mr-4 mt-1"></i>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Tradition</h3>
                  <p className="text-gray-700">We honor our long and proud history while looking forward to a bright future on the water.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marina Life Gallery */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Life at the Marina</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img 
              src="/assets/images/ppyc-images/dockal.jpg" 
              alt="Marina docks" 
              className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
            <img 
              src="/assets/images/ppyc-images/dinghy.jpg" 
              alt="Boats at dock" 
              className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
            <img 
              src="/assets/images/ppyc-images/matches.jpg" 
              alt="Sailing race" 
              className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
            <img 
              src="/assets/images/ppyc-images/deck.jpg" 
              alt="Club deck" 
              className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
            />
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-center">
            <i className="fas fa-anchor text-white mr-3"></i>
            Join Our Crew
          </h2>
          <p className="text-xl mb-6">
            Whether you're a seasoned mariner or just looking to dip your toes in the water, we invite you to learn more about our community.
          </p>
          <p className="text-lg mb-8">
            Discover the benefits of membership and find out how you can become part of the Pleasant Park Yacht Club story.
          </p>
          <a 
            href="/membership" 
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <i className="fas fa-users mr-2"></i>
            Learn More About Joining
          </a>
        </section>
      </article>
    </div>
  );
}

export default AboutPage; 