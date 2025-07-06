# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Create admin user
admin = User.find_or_create_by(email: 'admin@ppyc.org') do |user|
  user.password = 'password123'
  user.password_confirmation = 'password123'
  puts "Created admin user: admin@ppyc.org"
end

puts "Admin user ready: #{admin.email}"

# Create sample posts based on real PPYC content
posts = [
  {
    title: "4th of July Party!!!",
    content: "Join us for our annual Independence Day celebration! We'll have fireworks viewing from the marina, BBQ, live music, and family fun activities. This is one of our most popular events of the year - don't miss it! Bring your chairs and blankets for the best fireworks viewing on the water.",
    published_at: 6.days.ago,
    featured_image_url: "/assets/images/ppyc-images/party2.jpg"
  },
  {
    title: "Neighborhood Dog Band",
    content: "Get ready for an amazing musical evening! The Neighborhood Dog Band will be performing at the club this Saturday. Known for their fantastic covers and original music, this local favorite always draws a great crowd. Food and drinks available. Members and guests welcome!",
    published_at: 1.day.ago,
    featured_image_url: "/assets/images/ppyc-images/kickoffparty1.jpg"
  },
  {
    title: "Welcome to the 2025 Sailing Season!",
    content: "We're excited to kick off another fantastic year at Pleasant Park Yacht Club. Our marina is ready, our boats are prepped, and the water is calling! For the purpose of encouraging members in the proficiency in navigation, in matters pertaining to seamanship and personal management of yachts, and to promote social welfare.",
    published_at: 1.week.ago,
    featured_image_url: "/assets/images/ppyc-images/sunset.jpg"
  }
]

posts.each do |post_data|
  post = Post.create!(
    title: post_data[:title],
    content: post_data[:content],
    published_at: post_data[:published_at],
    author: admin,
    featured_image_url: post_data[:featured_image_url]
  )
  puts "Created post: #{post.title}"
end

# Create sample events based on real PPYC activities
events = [
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
    title: "Hall Rental Available",
    description: "Planning a special event? Our beautiful hall is available for rent for weddings, parties, corporate events, and more. Contact our office for pricing and availability. Stunning waterfront views included!",
    start_time: 1.month.from_now.change(hour: 10, min: 0),
    end_time: 1.month.from_now.change(hour: 16, min: 0),
    location: "PPYC Event Hall",
    image_url: "/assets/images/ppyc-images/Resized_20171209_152037.jpeg"
  }
]

events.each do |event_data|
  event = Event.create!(event_data)
  puts "Created event: #{event.title}"
end

# Create sample pages based on real PPYC site structure
pages = [
  {
    title: "About Pleasant Park Yacht Club",
    slug: "about",
    content: "Pleasant Park Yacht Club has been serving the maritime community since 1910. For the purpose of encouraging members in the proficiency in navigation, in matters pertaining to seamanship and personal management of yachts, and to promote social welfare... We are a welcoming community dedicated to preserving maritime traditions and fostering a love of boating.",
    is_published: true
  },
  {
    title: "History",
    slug: "history",
    content: "Founded in 1910, Pleasant Park Yacht Club has over a century of rich maritime history. From our humble beginnings to becoming a cornerstone of the local boating community, we've maintained our commitment to seamanship education and social fellowship. Our clubhouse and marina have evolved over the decades, but our core values remain unchanged.",
    is_published: true
  },
  {
    title: "Hall Rental",
    slug: "hall-rental",
    content: "Looking for the perfect venue for your special event? Our beautiful waterfront hall is available for rent for weddings, corporate events, parties, and celebrations. With stunning marina views and full catering capabilities, we provide an unforgettable setting for your important occasions. Contact our office for availability and pricing.",
    is_published: true
  },
  {
    title: "Marina Layout",
    slug: "marina-layout",
    content: "Our marina features modern floating docks with water and electrical hookups, fuel dock, pump-out stations, and winter storage facilities. We accommodate vessels from small day sailors to larger cruising yachts. Our experienced harbormaster ensures safe and efficient marina operations year-round.",
    is_published: true
  },
  {
    title: "Services",
    slug: "services",
    content: "Pleasant Park Yacht Club offers comprehensive marina services including seasonal slip rental, transient dockage, fuel dock, pump-out facilities, winter storage, and boat maintenance services. We also provide sailing instruction, youth programs, and various member services to enhance your boating experience.",
    is_published: true
  }
]

pages.each do |page_data|
  page = Page.create!(page_data)
  puts "Created page: #{page.title}"
end

# Create sample slides for TV display
slides = [
  {
    title: "Welcome to PPYC!",
    slide_type: "announcement",
    content: "Pleasant Park Yacht Club\nYour home on the water since 1910",
    active_status: true,
    display_order: 1,
    duration_seconds: 10,
    image_url: "/assets/images/ppyc-images/ppyc-hero.png"
  },
  {
    title: "Taco Tuesday",
    slide_type: "event_promo",
    content: "Every Tuesday 6PM\nDelicious tacos & great company\nMembers & guests welcome",
    active_status: true,
    display_order: 2,
    duration_seconds: 8
  },
  {
    title: "Marina Life",
    slide_type: "photo",
    content: "",
    active_status: true,
    display_order: 3,
    duration_seconds: 15,
    image_url: "/assets/images/ppyc-images/dinghy.jpg"
  },
  {
    title: "Weather & Marine Conditions",
    slide_type: "weather",
    content: "",
    active_status: true,
    display_order: 4,
    duration_seconds: 20,
    location: "Boston, MA",
    weather_type: "current"
  },
  {
    title: "Join Today!",
    slide_type: "announcement",
    content: "New Members Welcome\nContact us at info@ppyc.org\nOr visit our membership desk",
    active_status: true,
    display_order: 5,
    duration_seconds: 12
  },
  {
    title: "Sunset at PPYC",
    slide_type: "photo",
    content: "",
    active_status: true,
    display_order: 6,
    duration_seconds: 20,
    image_url: "/assets/images/ppyc-images/sunset2.jpg"
  }
]

slides.each do |slide_data|
  slide = Slide.create!(slide_data)
  puts "Created slide: #{slide.title}"
end

puts "Seed data created successfully!"
