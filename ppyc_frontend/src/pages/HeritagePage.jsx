import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_NAMES } from '../config/fontawesome';
import SEOHelmet from '../components/SEOHelmet';
import { YACHT_CLUB_ASSETS } from '../config/cloudinary';
import CloudinaryVideo from '../components/CloudinaryVideo';

const HeritagePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHelmet
        title="Heritage - Pleasant Park Yacht Club"
        description="Discover the rich history and heritage of Pleasant Park Yacht Club, serving the boating community since 1894."
      />

      {/* Hero Section with Video Background */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <CloudinaryVideo
            publicId={YACHT_CLUB_ASSETS.videos.bostonWaterfront}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Our Heritage
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Over a century of maritime tradition and community spirit.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-6xl mx-auto px-6 py-16">
        {/* Founding Visionaries */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={ICON_NAMES.ANCHOR} className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              The Founding Vision (1910)
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our embryonic or early stages of development began in the minds of <strong>Henry B. Fiske</strong>, <strong>Fred J. Karrer</strong>, <strong>Nathaniel T. Freeman</strong>, <strong>Charles E. Clarke</strong>, <strong>Eli Moore</strong>, <strong>Augustus E. Wyman</strong>, <strong>Gilbert W. Rich</strong>, <strong>William A. Clisby</strong>, <strong>Leonard T. Farris</strong>, <strong>Charles S. Winne</strong>, <strong>Hugh J. Shaw</strong> and others.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Like all good ships, plans had to be made. The entire crew met in the quarters of Henry B. Fiske at the corner of Main and Pleasant Street in Winthrop, Massachusetts on <strong>August 12, 1910</strong>. The results? Mr. Fiske was elected Chairman and Mr. Freeman Permanent Clerk.
            </p>
          </div>
        </section>

        {/* Early Development Timeline */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={ICON_NAMES.CLOCK} className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">The Birth of a Club</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <FontAwesomeIcon icon={ICON_NAMES.CALENDAR_ALT} className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">September 18, 1910</h3>
                    <p className="text-gray-600">Land Acquisition</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Less than five weeks later, the ambitious group met in the home of Commodore Fiske and decided to purchase land fronting Pleasant Street belonging to Mr. Jeremiah Green.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <FontAwesomeIcon icon={ICON_NAMES.FLAG} className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">September 27, 1910</h3>
                    <p className="text-gray-600">First Flag Raising</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  With a good keel under her, our good ship shaped up fast! The mainmast was stepped on the club pier. An appropriate Flag Raising ceremony marked the beginning of a daily custom which continues to this day.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <FontAwesomeIcon icon={ICON_NAMES.FILE} className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">November 1, 1910</h3>
                    <p className="text-gray-600">Official Charter</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Charter granted by the Commonwealth of Massachusetts. The Pleasant Park Yacht Club, consisting of a pier and a float in the northwest corner of Main and Pleasant Streets became a reality.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <FontAwesomeIcon icon={ICON_NAMES.HOME} className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">September 2, 1911</h3>
                    <p className="text-gray-600">First Clubhouse</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  A one-story club house was completed and dedicated. Who said things moved slowly in the old days? Just over a year from first thought to first structure!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Historical Image Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={ICON_NAMES.IMAGE} className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Historical Photos</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="/assets/images/ppyc-images/ppyc1920a-768x518.jpg" 
                alt="PPYC in 1920" 
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-sm text-gray-500 text-center mt-2 italic">PPYC in 1920 - Early expansion years</p>
            </div>
            <div>
              <img 
                src="/assets/images/ppyc-images/ppycclub.jpg" 
                alt="Historic PPYC clubhouse" 
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-sm text-gray-500 text-center mt-2 italic">The original clubhouse and marina</p>
            </div>
          </div>
        </section>

        {/* Growth and Development */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={ICON_NAMES.SHIP} className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Growth and Innovation (1915-1930)
            </h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              A lot of "dredging talk" went on with little results until the earnest efforts of State Senator Edward Bagley resulted in the <strong>1915 dredging of the Basin</strong>. The added depth proved a boon to sailors and power boats alike.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Although World War I marked its effect on our club and yachting interests in general, there was little activity during 1918-1924. In <strong>1924</strong>, the membership elected <strong>Louis DeGraves</strong> as Commodore. His leadership was instrumental in reviving club activities.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              In <strong>1926</strong>, a second story was added consisting of a beautiful main hall complete with pool tables, a reading room, a directors' room, and a large locker room. The first meeting in the new hall was held on the first Tuesday in January, 1927.
            </p>
          </div>
        </section>

        {/* Tercentenary Achievement */}
        <section className="mb-16">
          <div className="bg-blue-50 rounded-xl p-8">
            <div className="text-center mb-6">
              <FontAwesomeIcon icon={ICON_NAMES.TROPHY} className="text-blue-600 text-4xl mb-4" />
              <h3 className="text-2xl font-bold text-slate-800">1930 Tercentenary Celebration</h3>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              On August 2, 1930, Pleasant Park members participated in the Winthrop Tercentenary celebration by building and parading a large float with a replica of the Schooner Franklin. We were awarded <strong>third prize (cash)</strong> which we donated to the Winthrop Community Hospital.
            </p>
          </div>
        </section>

        {/* The Depression Era */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={ICON_NAMES.SHIELD} className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Resilience Through Adversity (1930s-1940s)</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                  <FontAwesomeIcon icon={ICON_NAMES.SHIELD} className="text-blue-600 mr-3" />
                  Depression Era Expansion
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In spite of the "Big Depression," the club continued to prosper. The period of 1932-1935 saw a new addition to the south side of the building with additional lockers and a tile shower bath!
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>George Hamilton</strong> served the longest term of any Commodore - 12 years from 1932-1944.
                </p>
              </div>
            </div>
            <div>
              <img 
                src="/assets/images/ppyc-images/ppyc-1921a-768x558.jpg" 
                alt="PPYC in the 1920s" 
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-sm text-gray-500 text-center mt-2 italic">PPYC during the prosperous 1920s</p>
            </div>
          </div>
        </section>

        {/* Radio Class Innovation */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center justify-center">
              <FontAwesomeIcon icon={ICON_NAMES.SAILBOAT} className="text-blue-600 mr-3" />
              The Radio Class Revolution (1935)
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              In March 1935, the Regatta Committee commissioned <strong>Mr. Samuel S. Crocker</strong> to design a new boat known as the <strong>Radio Class</strong>. By June, <strong>Mr. Willis J. Reid</strong> delivered six of these boats, with one additional boat built by Arthur Landry.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This boat created wide interest because of its stability and speed. The 1935 prediction that "this class in 1936 will no doubt be the largest class sailing from any club" proved remarkably prescient.
            </p>
          </div>
        </section>

        {/* The Fire and Rebirth */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={ICON_NAMES.SHIELD} className="text-4xl text-red-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Tragedy and Triumph (1958-1959)</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto"></div>
          </div>
          
          <div className="bg-red-50 rounded-xl p-8 border-l-4 border-red-500">
            <div className="flex items-start">
              <FontAwesomeIcon icon={ICON_NAMES.WARNING} className="text-red-600 text-3xl mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">The Great Fire of 1958</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  On <strong>June 27, 1958</strong>, flames swept by a brisk on-shore wind completely devastated the club house. Fortunately, of the twenty or so members in the building at the time, only 4-5 received minor injuries.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Although members were depressed, tired and dirty that night, the prevailing talk was <em>"a new club house – when can we start – how much will it cost..."</em> The determination of 300 members resulted in our beautiful new building being completed by August 4, 1959.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Modern Era Highlights */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <FontAwesomeIcon icon={ICON_NAMES.CLOCK} className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Modern Developments (1960s-2010)</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={ICON_NAMES.USERS} className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 text-center">1963: Crew's Quarters</h3>
                <p className="text-gray-700 text-center">
                  Members built and completed the upstairs room, creating the "Crew's Quarters" with full bar and entertainment facilities.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={ICON_NAMES.ANCHOR} className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 text-center">1967-1971: Marina Development</h3>
                <p className="text-gray-700 text-center">
                  Under Commodores Al Marley Jr. and Pat Marino, the modern marina took shape with new floats and expanded facilities.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={ICON_NAMES.STAR} className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 text-center">1989: First Female Member</h3>
                <p className="text-gray-700 text-center">
                  <strong>Alice Kneeland</strong> became the first female member, marking a historic milestone in club inclusivity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Centennial Achievement */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white text-center">
            <div className="mb-6">
              <FontAwesomeIcon icon={ICON_NAMES.TROPHY} className="text-6xl mb-4" />
              <h2 className="text-4xl font-bold mb-4">Centennial Celebration (2010)</h2>
              <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            </div>
            <p className="text-xl leading-relaxed mb-6">
              Under Commodore <strong>Christopher Wolseley</strong>, the club celebrated its remarkable <strong>100th anniversary</strong> in 2010, completing extensive renovations and improvements in preparation for the centennial celebration.
            </p>
            <p className="text-lg">
              From a simple pier and float to a thriving maritime community - a century of excellence on the water.
            </p>
          </div>
        </section>

        {/* Legacy Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <FontAwesomeIcon icon={ICON_NAMES.HEART} className="text-4xl text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Enduring Legacy</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-xl shadow-lg p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={ICON_NAMES.USERS} className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Community Spirit</h3>
              <p className="text-gray-600">
                Over a century of members working together, building together, and celebrating together.
              </p>
            </div>
            
            <div className="text-center bg-white rounded-xl shadow-lg p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={ICON_NAMES.WATER} className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Maritime Excellence</h3>
              <p className="text-gray-600">
                From the Radio Class innovation to modern marina development, always at the forefront of boating.
              </p>
            </div>
            
            <div className="text-center bg-white rounded-xl shadow-lg p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={ICON_NAMES.HEART} className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Family Tradition</h3>
              <p className="text-gray-600">
                Generations of families have called PPYC home, creating lasting memories on the water.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-slate-900 rounded-xl p-8 text-white">
            <div className="mb-6">
              <FontAwesomeIcon icon={ICON_NAMES.USERS} className="text-5xl text-blue-300" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Join Our Story</h2>
            <p className="text-xl mb-8 opacity-90">
              Become part of our continuing heritage. The next chapter of Pleasant Park Yacht Club's story includes you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/membership" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                <FontAwesomeIcon icon={ICON_NAMES.USERS} />
                Learn About Membership
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                <FontAwesomeIcon icon={ICON_NAMES.EMAIL} />
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};

export default HeritagePage; 