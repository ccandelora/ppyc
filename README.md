# Pleasant Park Yacht Club Website

A modern, full-stack web application for Pleasant Park Yacht Club, built with Ruby on Rails API backend and React frontend.

## 🚀 Features

- **Modern Design**: Clean, intuitive interface optimized for all ages (young adults to seniors)
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Content Management**: Full CRUD operations for posts, events, pages, and slides
- **TV Slideshow**: Special display mode for in-club screens with auto-cycling slides
- **SEO Friendly**: Clean URLs with slugs for better search engine optimization
- **Member & Public Content**: Separate sections for public information and member resources

## 🛠 Tech Stack

### Backend
- **Ruby on Rails 7+** (API-only mode)
- **PostgreSQL** database
- **Devise** for authentication
- **FriendlyId** for URL slugs
- **Kaminari** for pagination

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

## 🏗 Project Structure

```
ppyc/
├── ppyc_backend/          # Rails API backend
│   ├── app/
│   │   ├── controllers/api/v1/
│   │   ├── models/
│   │   └── ...
│   ├── db/
│   └── config/
├── ppyc_frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── public/
└── README.md
```

## 📦 Installation & Setup

### Prerequisites
- Ruby 3.3.0
- Node.js 18+
- PostgreSQL 12+

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd ppyc_backend
   ```

2. **Install dependencies:**
   ```bash
   bundle install
   ```

3. **Setup database:**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

4. **Start the Rails server:**
   ```bash
   rails server -p 3000
   ```

   The API will be available at `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ppyc_frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The website will be available at `http://localhost:5173`

## 🎯 Key URLs

### Main Website
- **Homepage**: `http://localhost:5173/`
- **About**: `http://localhost:5173/about`
- **Events**: `http://localhost:5173/events`
- **News**: `http://localhost:5173/news`
- **Membership**: `http://localhost:5173/membership`
- **Marina**: `http://localhost:5173/marina`
- **History**: `http://localhost:5173/history`

### Special Features
- **TV Display**: `http://localhost:5173/tv-display` (for in-club screens)

### API Endpoints
- **Posts**: `http://localhost:3000/api/v1/posts`
- **Events**: `http://localhost:3000/api/v1/events`
- **Pages**: `http://localhost:3000/api/v1/pages/:slug`
- **Slides**: `http://localhost:3000/api/v1/slides`

## 👥 Default Users

After running `rails db:seed`, you'll have:

- **Admin User**: 
  - Email: `admin@ppyc.org`
  - Password: `password123`
  - Role: `admin`

## 📱 TV Slideshow Feature

The TV display feature (`/tv-display`) is designed for in-club screens:

- **Auto-cycling slides** with customizable durations
- **High-contrast design** for easy reading from a distance
- **Multiple slide types**: announcements, event promos, photos
- **Real-time clock** and club branding
- **Admin-manageable content** through the CMS

To use:
1. Open `/tv-display` in a full-screen browser
2. Manage slides through the admin interface
3. Slides will auto-cycle based on their duration settings

## 🎨 Design Philosophy

- **Blue-collar friendly**: Intuitive navigation and clear content hierarchy
- **Yacht club aesthetic**: Navy blue and maritime-inspired color scheme
- **Accessibility**: High contrast, readable fonts, responsive design
- **Community focused**: Promotes membership and showcases club activities

## 🔧 Admin Features

- **Content Management**: Create, edit, and publish posts, events, and pages
- **Slide Management**: Control TV display content with ordering and activation
- **User Roles**: Admin, editor, and member access levels
- **SEO Controls**: Manage slugs and meta content

## 🚀 Deployment

For production deployment:

1. **Backend**: Deploy Rails API to services like Heroku, Railway, or DigitalOcean
2. **Frontend**: Deploy React app to Vercel, Netlify, or similar
3. **Database**: Use managed PostgreSQL service
4. **Environment Variables**: Configure production API URLs and database connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions or support:
- **Email**: admin@ppyc.org
- **Phone**: (248) 555-SAIL

---

**Pleasant Park Yacht Club** - *Your home on the water since 1910* ⚓ 