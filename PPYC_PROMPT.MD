Of course! This is an excellent project for a modern tech stack. A well-structured prompt is key to getting the most out of an AI agent like Cursor.

The prompt below is designed to be comprehensive. It breaks down the project into logical parts, defines the data structures (models), outlines the API, specifies the frontend components, and gives clear instructions for the new TV slideshow feature.

You can copy and paste this directly into the Cursor chat.

---

### **Cursor AI Prompt: PPYC Website Modernization Project**

**Objective:**
Act as an expert full-stack developer. Your task is to build a new, modernized website for the Pontiac Yacht Club (PYYC) to replace their existing WordPress site at `ppyc1910.org`. The new application will be built from scratch using a modern tech stack. You will also implement a new "TV Slideshow" feature for in-club display.

**Core Technology Stack:**
*   **Backend:** Ruby on Rails 7+ (in API-only mode)
*   **Database:** PostgreSQL
*   **Frontend:** React (using Vite for the build tool)
*   **Styling:** Tailwind CSS for a utility-first approach.
*   **Authentication:** Devise for user/admin management.

---

### **Phase 1: Backend Setup (Rails API & Database Schema)**

**1. Initialize the Project:**
Create a new Rails 7 API-only application configured for PostgreSQL. Set up a `cors.rb` initializer to allow requests from the React frontend's development server (e.g., `localhost:5173`).

```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:5173' # Or your React dev server address
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

**2. Define the Database Models:**
Generate the following Rails models with the specified attributes. These will form the core of our content management system.

*   **User:** For admin access.
    *   Use the `devise` gem for authentication.
    *   `email:string`
    *   `encrypted_password:string`
    *   `role:string` (e.g., 'admin', 'editor')

*   **Post:** For news and announcements.
    *   `title:string`
    *   `content:text`
    *   `author:references` (links to User)
    *   `published_at:datetime`
    *   `slug:string` (for clean URLs)
    *   `featured_image_url:string`

*   **Event:** For the club's event calendar.
    *   `title:string`
    *   `description:text`
    *   `start_time:datetime`
    *   `end_time:datetime`
    *   `location:string`
    *   `image_url:string`

*   **Page:** For static content like "About Us," "Join," "Fleet Info."
    *   `title:string`
    *   `slug:string` (e.g., 'about-us', 'history')
    *   `content:text` (will support Markdown or a rich text editor)
    *   `is_published:boolean`

*   **Slide:** For the new TV display feature.
    *   `title:string` (e.g., "Taco Tuesday!")
    *   `slide_type:string` (e.g., 'announcement', 'event_promo', 'photo')
    *   `content:text` (for text-based slides)
    *   `image_url:string` (for image-based slides)
    *   `active_status:boolean` (to easily enable/disable slides)
    *   `display_order:integer` (to control the sequence)
    *   `duration_seconds:integer` (defaults to 60)

**3. Create API Endpoints (Controllers):**
Create versioned API controllers under an `api/v1` namespace.

*   **Public Endpoints (No Authentication Required):**
    *   `GET /api/v1/posts` - Returns a list of all published posts.
    *   `GET /api/v1/posts/:slug` - Returns a single post.
    *   `GET /api/v1/events` - Returns a list of upcoming events (ordered by `start_time`).
    *   `GET /api/v1/pages/:slug` - Returns the content for a static page.
    *   `GET /api/v1/slides` - Returns all `active` slides, ordered by `display_order`.

*   **Admin Endpoints (Authentication Required):**
    *   Create a separate `api/v1/admin` namespace protected by Devise.
    *   Implement full CRUD (Create, Read, Update, Delete) endpoints for `Posts`, `Events`, `Pages`, and `Slides`.

---

### **Phase 2: Frontend Development (React)**

**1. Initialize the React App:**
Set up a new React project in a `client` subdirectory using `vite`. Configure `axios` for making API calls to the Rails backend. Set up `react-router-dom` for client-side routing.

**2. Create Core Components:**
*   `Layout.js`: A main layout component with a `Header` (including navigation), a `Footer`, and an `Outlet` for rendering the page content.
*   `Navigation.js`: The main site navigation bar, mirroring the old site's structure (Home, About, Join, Events, News, etc.).
*   `AdminLayout.js`: A separate layout for the admin section.

**3. Build the Pages (Views):**
Create a React component for each main page. These components will fetch data from your Rails API endpoints.
*   `HomePage.js`: Displays a welcome message, a list of the next 3 upcoming events, and the 3 most recent news posts.
*   `EventsPage.js`: Displays a full list of all upcoming events.
*   `NewsPage.js`: Displays a list of all news posts with pagination.
*   `PostDetailsPage.js`: Displays a single news post.
*   `StaticPage.js`: A generic component that takes a `slug` prop, fetches data from the `/api/v1/pages/:slug` endpoint, and renders the content.

**4. Build the Admin Dashboard:**
Create a secure area at `/admin`.
*   Implement a login page using the `users/sign_in` endpoint from Devise.
*   After login, show a dashboard with links to manage:
    *   **Events Management:** A table of all events with "Edit" and "Delete" buttons, and a "Create New Event" form.
    *   **Posts Management:** Same CRUD interface for news posts.
    *   **Pages Management:** Interface to edit static page content.
    *   **Slides Management:** A dedicated interface to create, edit, reorder, and activate/deactivate slides for the TV display.

---

### **Phase 3: The TV Slideshow Feature**

This is the key new feature.

**1. Create the TV Display Route and Component:**
*   Create a dedicated route in `react-router-dom` at `/tv-display`.
*   Create a new component named `TVDisplay.js`.

**2. Implement the `TVDisplay.js` Component Logic:**
*   On component mount, fetch all active slides from the `GET /api/v1/slides` endpoint.
*   Use `useState` to store the array of slides and the index of the currently visible slide, e.g., `const [currentSlideIndex, setCurrentSlideIndex] = useState(0)`.
*   Use a `useEffect` hook with a `setTimeout` to cycle through the slides.
    *   The delay should be determined by the `duration_seconds` property of the *current* slide (defaulting to 60 seconds if not set).
    *   When the timer completes, update the `currentSlideIndex`, looping back to 0 when it reaches the end of the slides array.
    *   The effect should have a cleanup function that calls `clearTimeout` to prevent memory leaks.

**3. Design the Slide Templates:**
*   Within `TVDisplay.js`, conditionally render the slide based on its `slide_type`.
*   **Styling is critical:** Use large, high-contrast fonts (e.g., white text on a dark blue background). Ensure images fill the screen or are displayed prominently. The content must be easily readable from a distance in a potentially well-lit bar.
*   Create different visual templates for each `slide_type`:
    *   **'announcement'**: Large title, medium-sized body text.
    *   **'event_promo'**: Event Title, Date/Time, Location, and a background image (`image_url`).
    *   **'photo'**: A full-screen display of the `image_url`.

**Final Goal:** The final product should be a fully functional website with a simple-to-use admin panel for managing all content, including the new TV slides. The `/tv-display` URL can be opened in a full-screen browser on any TV connected to a computer.