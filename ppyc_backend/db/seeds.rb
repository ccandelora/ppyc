# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Initialize default settings
puts "Initializing default settings..."
Setting.initialize_defaults!
puts "Default settings initialized successfully!"

# Print summary
settings_count = Setting.count
puts "Total settings: #{settings_count}"
Setting.grouped_by_category.each do |category, settings|
  puts "  #{category}: #{settings.keys.count} settings"
end

puts "🌊 Seeding Pleasant Park Yacht Club Database..."

# Create admin user
admin = User.find_or_create_by(email: 'admin@ppyc.org') do |user|
  user.password = 'password123'
  user.password_confirmation = 'password123'
  puts "Created admin user: admin@ppyc.org"
end

# Create Chris's user account
chris = User.find_or_create_by(email: 'chris.candelora@gmail.com') do |user|
  user.password = 'Bytes1010'
  user.password_confirmation = 'Bytes1010'
  puts "Created user: chris.candelora@gmail.com"
end

# Create additional staff/member users
commodore = User.find_or_create_by(email: 'commodore@ppyc.org') do |user|
  user.password = 'password123'
  user.password_confirmation = 'password123'
  puts "Created commodore user: commodore@ppyc.org"
end

harbormaster = User.find_or_create_by(email: 'harbormaster@ppyc.org') do |user|
  user.password = 'password123'
  user.password_confirmation = 'password123'
  puts "Created harbormaster user: harbormaster@ppyc.org"
end

social_chair = User.find_or_create_by(email: 'social@ppyc.org') do |user|
  user.password = 'password123'
  user.password_confirmation = 'password123'
  puts "Created social chair user: social@ppyc.org"
end

puts "✅ Users created successfully!"

# Create comprehensive posts spanning different time periods
posts = [
  {
    title: "4th of July Party!!!",
    content: "Join us for our annual Independence Day celebration! We'll have fireworks viewing from the marina, BBQ, live music, and family fun activities. This is one of our most popular events of the year - don't miss it! Bring your chairs and blankets for the best fireworks viewing on the water.",
    published_at: 6.days.ago,
    author: social_chair,
    featured_image_url: "/assets/images/ppyc-images/party2.jpg"
  },
  {
    title: "Neighborhood Dog Band",
    content: "Get ready for an amazing musical evening! The Neighborhood Dog Band will be performing at the club this Saturday. Known for their fantastic covers and original music, this local favorite always draws a great crowd. Food and drinks available. Members and guests welcome!",
    published_at: 1.day.ago,
    author: social_chair,
    featured_image_url: "/assets/images/ppyc-images/kickoffparty1.jpg"
  },
  {
    title: "Welcome to the 2025 Sailing Season!",
    content: "We're excited to kick off another fantastic year at Pleasant Park Yacht Club. Our marina is ready, our boats are prepped, and the water is calling! For the purpose of encouraging members in the proficiency in navigation, in matters pertaining to seamanship and personal management of yachts, and to promote social welfare.",
    published_at: 1.week.ago,
    author: commodore,
    featured_image_url: "/assets/images/ppyc-images/sunset.jpg"
  },
  {
    title: "Spring Dock Installation Complete",
    content: "Our hardworking dock crew has completed the spring dock installation! All slips are now ready for the season. Thank you to our volunteers who helped with this massive undertaking. The marina looks fantastic and we're ready for boats to arrive. Slip holders can begin moving boats in immediately.",
    published_at: 2.weeks.ago,
    author: harbormaster,
    featured_image_url: "/assets/images/ppyc-images/dinghy.jpg"
  },
  {
    title: "Annual Membership Meeting Recap",
    content: "Thank you to everyone who attended our annual membership meeting last month. We covered budget updates, marina improvements, upcoming events, and elected new board members. Key highlights include new dock improvements, expanded youth sailing program, and our 115th anniversary celebration plans.",
    published_at: 3.weeks.ago,
    author: commodore,
    featured_image_url: "/assets/images/ppyc-images/ppyc1951.jpg"
  },
  {
    title: "Youth Sailing Program Registration Open",
    content: "Registration is now open for our youth sailing program! We offer beginner through advanced instruction for ages 8-18. Our certified instructors focus on safety, seamanship, and fun on the water. Programs run June through August with flexible scheduling. Contact our office for details and registration forms.",
    published_at: 4.weeks.ago,
    author: admin,
    featured_image_url: "/assets/images/ppyc-images/ppyc-small-boat.jpg"
  },
  {
    title: "Winter Storage Wrap-Up",
    content: "Thanks to everyone who helped with our winter storage operations. Over 150 boats were successfully stored and covered for the winter. Special thanks to our yard crew and the many member volunteers who made this massive undertaking possible. Spring launch schedules will be posted next month.",
    published_at: 5.weeks.ago,
    author: harbormaster,
    featured_image_url: "/assets/images/ppyc-images/winterppyc.jpg"
  },
  {
    title: "Holiday Party Success!",
    content: "What a wonderful holiday party we had! Over 200 members and guests joined us for an evening of great food, music, and celebration. The decorations were beautiful, the band was fantastic, and everyone had a wonderful time. Thanks to our social committee for organizing such a memorable event.",
    published_at: 6.weeks.ago,
    author: social_chair,
    featured_image_url: "/assets/images/ppyc-images/party1.jpg"
  },
  {
    title: "Clubhouse Renovation Update",
    content: "Our clubhouse renovation project is progressing well! The new kitchen equipment has been installed, the main dining room has been refreshed, and we've added new lighting throughout. The bar area renovation will begin next month. We appreciate your patience during this exciting improvement phase.",
    published_at: 8.weeks.ago,
    author: admin,
    featured_image_url: "/assets/images/ppyc-images/ppyc1951_men_at_bar-768x563.jpg"
  },
  {
    title: "Sailing Instruction Available",
    content: "Looking to learn to sail or improve your skills? Our certified sailing instructors are available for private and group lessons. We offer beginner courses, advanced seamanship training, and racing instruction. All skill levels welcome. Contact the office to schedule your lessons today!",
    published_at: 2.months.ago,
    author: admin,
    featured_image_url: "/assets/images/ppyc-images/float.jpg"
  },
  {
    title: "Marina Safety Reminder",
    content: "As we head into peak boating season, please remember our marina safety guidelines: Always wear life jackets when boarding dinghies, observe the 5 mph speed limit in the marina, and secure all dock lines properly. Our harbormaster is always available to help with any questions or concerns.",
    published_at: 2.months.ago,
    author: harbormaster,
    featured_image_url: "/assets/images/ppyc-images/dinghy2.jpg"
  },
  {
    title: "PPYC History Project",
    content: "We're working on a comprehensive history project to document our club's rich 115-year heritage. If you have historical photos, documents, or stories to share, please contact the office. We're particularly interested in materials from the 1950s-1980s. Help us preserve our legacy for future generations!",
    published_at: 3.months.ago,
    author: admin,
    featured_image_url: "/assets/images/ppyc-images/ppyc-1921a-768x558.jpg"
  }
]

posts.each do |post_data|
  post = Post.find_or_create_by(title: post_data[:title]) do |p|
    p.assign_attributes(post_data)
  end
  puts "Created/found post: #{post.title}"
end

# Create comprehensive events (both past and future)
events = [
  # Future Events
  {
    title: "Neighborhood Dog Band Live Performance",
    description: "Join us for an incredible evening of live music with the Neighborhood Dog Band! This local favorite will perform their best covers and original songs. Food and beverages available. Perfect night out for members and their guests.",
    start_time: 5.days.from_now.change(hour: 19, min: 0),
    end_time: 5.days.from_now.change(hour: 22, min: 0),
    location: "PPYC Clubhouse & Deck",
    image_url: "/assets/images/ppyc-images/Resized_20171209_151555.jpeg"
  },
  {
    title: "4th of July Fireworks Celebration",
    description: "Our annual Independence Day party! Best fireworks viewing on the water, BBQ dinner, live patriotic music, and family activities. Bring chairs and blankets for optimal fireworks viewing from our marina. This is our biggest social event of the summer!",
    start_time: 2.weeks.from_now.change(hour: 17, min: 0),
    end_time: 2.weeks.from_now.change(hour: 23, min: 0),
    location: "PPYC Marina & Grounds",
    image_url: "/assets/images/ppyc-images/party3.jpg"
  },
  {
    title: "Weekly Taco Tuesday",
    description: "Join us every Tuesday for our popular Taco Tuesday! Delicious tacos, great company, and special drink prices. A casual night out for the whole family. No reservations needed - just show up hungry!",
    start_time: 3.days.from_now.change(hour: 18, min: 0),
    end_time: 3.days.from_now.change(hour: 21, min: 0),
    location: "PPYC Bar & Grill",
    image_url: "/assets/images/ppyc-images/matches.jpg"
  },
  {
    title: "Youth Sailing Regatta",
    description: "Our annual youth sailing regatta! Young sailors will compete in various classes, with trophies and prizes for winners. Great opportunity to see our youth program in action. Spectators welcome! BBQ lunch available for purchase.",
    start_time: 3.weeks.from_now.change(hour: 10, min: 0),
    end_time: 3.weeks.from_now.change(hour: 16, min: 0),
    location: "PPYC Racing Area",
    image_url: "/assets/images/ppyc-images/ppyc-small-boat.jpg"
  },
  {
    title: "Annual Clambake",
    description: "Our traditional New England clambake returns! Fresh lobster, clams, corn on the cob, and all the fixings. Live music, dancing, and great company. This is always a sold-out event, so reserve your spot early!",
    start_time: 1.month.from_now.change(hour: 17, min: 0),
    end_time: 1.month.from_now.change(hour: 22, min: 0),
    location: "PPYC Lawn & Pavilion",
    image_url: "/assets/images/ppyc-images/ppyc1.png"
  },
  {
    title: "Sunset Jazz Series",
    description: "Join us for our monthly sunset jazz series! Enjoy smooth jazz while watching the sunset over the water. Light appetizers and signature cocktails available. Perfect for a romantic evening or night out with friends.",
    start_time: 6.weeks.from_now.change(hour: 19, min: 0),
    end_time: 6.weeks.from_now.change(hour: 22, min: 0),
    location: "PPYC Waterfront Deck",
    image_url: "/assets/images/ppyc-images/sunset3.jpg"
  },
  {
    title: "Fall Cocktail Reception",
    description: "Elegant cocktail reception to celebrate the fall season. Featuring seasonal appetizers, craft cocktails, and live acoustic music. Dress code: cocktail attire. Members and one guest per member.",
    start_time: 2.months.from_now.change(hour: 18, min: 0),
    end_time: 2.months.from_now.change(hour: 21, min: 0),
    location: "PPYC Main Dining Room",
    image_url: "/assets/images/ppyc-images/ppyc1951_men_at_bar-768x563.jpg"
  },
  {
    title: "Harbor Cleanup Day",
    description: "Join us for our annual harbor cleanup! We'll work together to keep our waters clean and beautiful. Supplies provided, lunch included. Great opportunity to give back to our marine environment and meet fellow members.",
    start_time: 10.days.from_now.change(hour: 9, min: 0),
    end_time: 10.days.from_now.change(hour: 14, min: 0),
    location: "PPYC Marina & Surrounding Waters",
    image_url: "/assets/images/ppyc-images/dinghy.jpg"
  },
  {
    title: "Wine Tasting Evening",
    description: "Exclusive wine tasting featuring selections from local vineyards. Learn about wine pairing with our sommelier and enjoy specially prepared appetizers. Limited seating - advance reservations required.",
    start_time: 3.weeks.from_now.change(hour: 19, min: 0),
    end_time: 3.weeks.from_now.change(hour: 22, min: 0),
    location: "PPYC Private Dining Room",
    image_url: "/assets/images/ppyc-images/Resized_20171209_152039.jpeg"
  },
  {
    title: "New Member Orientation",
    description: "Welcome session for new members! Learn about club facilities, services, traditions, and meet other new members. Tour of the marina, clubhouse, and facilities included. Light refreshments provided.",
    start_time: 2.weeks.from_now.change(hour: 14, min: 0),
    end_time: 2.weeks.from_now.change(hour: 17, min: 0),
    location: "PPYC Conference Room",
    image_url: "/assets/images/ppyc-images/ppyc-1919a-768x603.jpg"
  }
]

events.each do |event_data|
  event = Event.find_or_create_by(title: event_data[:title]) do |e|
    e.assign_attributes(event_data)
  end
  puts "Created/found event: #{event.title}"
end

# Create comprehensive pages
pages = [
  {
    title: "About Pleasant Park Yacht Club",
    slug: "about",
    content: "Pleasant Park Yacht Club has been serving the maritime community since 1910. Founded with the purpose of encouraging members in the proficiency in navigation, in matters pertaining to seamanship and personal management of yachts, and to promote social welfare. We are a welcoming community dedicated to preserving maritime traditions and fostering a love of boating. Our waterfront location offers stunning views, modern facilities, and a warm atmosphere where lifelong friendships are formed.",
    is_published: true
  },
  {
    title: "Club History",
    slug: "history",
    content: "Founded in 1910, Pleasant Park Yacht Club has over a century of rich maritime history. From our humble beginnings as a small group of sailing enthusiasts to becoming a cornerstone of the local boating community, we've maintained our commitment to seamanship education and social fellowship. Our clubhouse has welcomed thousands of members over the decades, each contributing to our vibrant maritime heritage. Through two world wars, economic challenges, and changing times, PPYC has remained a constant beacon for those who love the sea.",
    is_published: true
  },
  {
    title: "Marina Services",
    slug: "marina",
    content: "Our full-service marina features 200 slips accommodating vessels from 20 to 60 feet. Modern floating docks include water and 30/50 amp electrical service. Additional services include fuel dock, pump-out station, boat launch ramp, winter storage, and professional maintenance services. Our experienced harbormaster and dock crew ensure safe, efficient marina operations year-round. Launch service, dinghy dock, and guest moorings available.",
    is_published: true
  },
  {
    title: "Membership Information",
    slug: "membership",
    content: "PPYC welcomes new members who share our love of boating and maritime traditions. We offer several membership categories including Full, Associate, Junior, and Corporate memberships. Members enjoy full access to marina facilities, clubhouse dining, social events, and reciprocal privileges with other yacht clubs. Our membership committee is happy to answer questions and guide prospective members through the application process.",
    is_published: true
  },
  {
    title: "Events & Activities",
    slug: "events",
    content: "From casual weekly gatherings to elegant formal events, PPYC offers something for everyone. Our social calendar includes themed dinners, live music, educational seminars, fishing tournaments, and seasonal celebrations. We host sailing regattas, yacht club cruises, and family-friendly activities throughout the year. Our active committees organize everything from wine tastings to charity fundraisers, ensuring there's always something exciting happening at the club.",
    is_published: true
  },
  {
    title: "Dining & Catering",
    slug: "dining",
    content: "Our waterfront dining room offers spectacular views and delicious cuisine. Our chef specializes in fresh seafood and New England favorites, with daily specials featuring local ingredients. The clubhouse is also available for private events, weddings, and corporate functions. Our experienced catering staff can accommodate groups from 20 to 200 guests, with customized menus and full event planning services.",
    is_published: true
  },
  {
    title: "Youth Programs",
    slug: "youth",
    content: "PPYC is committed to introducing young people to sailing and seamanship. Our youth sailing program offers instruction for ages 8-18, from beginner to advanced racing levels. Led by certified instructors, our programs emphasize safety, skill development, and fun on the water. We also offer junior membership programs and family sailing activities to engage the next generation of maritime enthusiasts.",
    is_published: true
  },
  {
    title: "Hall Rentals",
    slug: "hall-rental",
    content: "Looking for the perfect venue for your special event? Our beautiful waterfront facilities are available for rent for weddings, corporate events, parties, and celebrations. With stunning marina views, elegant dining spaces, and full catering capabilities, we provide an unforgettable setting for your important occasions. Our event coordinators work with you to ensure every detail is perfect. Contact our office for availability and custom pricing packages.",
    is_published: true
  }
]

pages.each do |page_data|
  page = Page.find_or_create_by(slug: page_data[:slug]) do |p|
    p.assign_attributes(page_data)
  end
  puts "Created/found page: #{page.title}"
end

# Clear existing slides
puts "Clearing existing slides..."
Slide.destroy_all

# Create some initial slides
puts "Creating new slides..."
slides = [
  {
    title: "Welcome to Pleasant Park Yacht Club",
    content: "Established in 1925, we're proud to serve the Boston Harbor boating community.",
    slide_type: "announcement",
    duration_seconds: 30,
    active_status: true,
    display_order: 1,
    background_tint_color: "#000000",
    background_tint_opacity: 0.5
  },
  {
    title: "Marine Weather Update",
    content: "Stay informed about current conditions in Boston Harbor",
    slide_type: "weather",
    duration_seconds: 20,
    active_status: true,
    display_order: 2,
    location: "Boston Harbor, MA",
    weather_type: "marine",
    background_tint_color: "#000000",
    background_tint_opacity: 0.6
  },
  {
    title: "Summer Membership Drive",
    content: "Join our vibrant community! Special rates available for new members.",
    slide_type: "announcement",
    duration_seconds: 25,
    active_status: true,
    display_order: 3,
    background_tint_color: "#000000",
    background_tint_opacity: 0.4
  },
  {
    title: "Harbor Cleanup Event",
    content: "Join us this Saturday for our monthly harbor cleanup initiative. Meet at the clubhouse at 9 AM.",
    slide_type: "event_promo",
    duration_seconds: 20,
    active_status: true,
    display_order: 4,
    background_tint_color: "#000000",
    background_tint_opacity: 0.5
  }
]

slides.each do |slide_data|
  puts "Creating slide: #{slide_data[:title]}"
  Slide.create!(slide_data)
end

puts "Seed data creation complete!"

puts "🎉 Enhanced seed data created successfully!"
puts "📊 Summary:"
puts "   👥 Users: #{User.count}"
puts "   📝 Posts: #{Post.count}"
puts "   📅 Events: #{Event.count}"
puts "   📄 Pages: #{Page.count}"
puts "   🖼️  Slides: #{Slide.count}"
puts "🌊 Your yacht club site is now fully populated and ready to sail!"
