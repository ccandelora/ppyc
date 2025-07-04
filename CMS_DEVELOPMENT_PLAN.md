# PPYC Backend CMS Development Plan

## 🎯 Project Overview

Build a comprehensive Content Management System (CMS) for Pleasant Park Yacht Club that allows a single superuser to manage all website content including posts, slides, events, and pages with image uploads and WYSIWYG editing capabilities.

## 🔐 Authentication Strategy

### Single Superuser Approach
- **No member accounts needed** - Only one admin user account
- **Backdoor superuser creation** - Special rake task to create your admin account
- **Secure admin routes** - Protected `/admin` area
- **Session-based authentication** - Using Devise for simplicity

### Implementation
```ruby
# Create special rake task: lib/tasks/admin.rake
namespace :admin do
  desc "Create superuser account"
  task create_superuser: :environment do
    email = ENV['ADMIN_EMAIL'] || 'admin@ppyc.com'
    password = ENV['ADMIN_PASSWORD'] || SecureRandom.hex(10)
    
    user = User.find_or_create_by(email: email) do |u|
      u.password = password
      u.role = 'superuser'
    end
    
    puts "Superuser created: #{email} / #{password}"
  end
end
```

## 📝 Content Management Features

### 1. Posts Management
- ✅ **Already built** - Basic CRUD operations exist
- 🔄 **Enhance** - Add WYSIWYG editor integration
- 🔄 **Enhance** - Add featured image upload
- 🔄 **Enhance** - Add post categories/tags
- 🔄 **Enhance** - Add publish/draft status toggle

### 2. Slides Management  
- ✅ **Already built** - Basic model exists
- 🔄 **Enhance** - Add slide builder interface
- 🔄 **Enhance** - Add background image uploads
- 🔄 **Enhance** - Add different slide templates
- 🔄 **Enhance** - Add drag-and-drop reordering

### 3. Events Management
- ✅ **Already built** - Basic CRUD operations exist
- 🔄 **Enhance** - Add recurring events support
- 🔄 **Enhance** - Add event image uploads
- 🔄 **Enhance** - Add RSVP/attendance tracking

### 4. Pages Management
- ✅ **Already built** - Static pages exist
- 🔄 **Enhance** - Add WYSIWYG editing
- 🔄 **Enhance** - Add page templates
- 🔄 **Enhance** - Add SEO meta fields

### 5. Media Management
- 🆕 **New** - Image upload system
- 🆕 **New** - Media library browser
- 🆕 **New** - Image optimization/resizing
- 🆕 **New** - Bulk upload capability

## 🖥️ WYSIWYG Editor Selection

### Recommended: TinyMCE (Free)
**Why TinyMCE:**
- ✅ Free and open source
- ✅ Excellent React integration
- ✅ Beautiful, professional interface
- ✅ Image upload built-in
- ✅ Extensive customization
- ✅ Mobile responsive

**Alternative: Quill.js**
- ✅ Lightweight and fast
- ✅ Clean, modern interface
- ✅ Good React support
- ❌ Less feature-rich than TinyMCE

## 🏗️ Technical Architecture

### Backend Enhancements (Rails API)

#### New Controllers Needed
```ruby
# app/controllers/api/v1/admin/
- media_controller.rb       # Image uploads
- dashboard_controller.rb   # CMS dashboard
- settings_controller.rb    # Site settings
```

#### New Models Needed
```ruby
# app/models/
- attachment.rb            # For file uploads
- site_setting.rb         # Global site settings
```

#### File Upload System
```ruby
# Use Active Storage for file handling
rails active_storage:install

# Configure storage
# config/storage.yml
local:
  service: Disk
  root: <%= Rails.root.join("storage") %>

# In production, consider AWS S3
amazon:
  service: S3
  access_key_id: <%= Rails.application.credentials.dig(:aws, :access_key_id) %>
  secret_access_key: <%= Rails.application.credentials.dig(:aws, :secret_access_key) %>
  region: us-east-1
  bucket: ppyc-media
```

### Frontend Admin Interface

#### New Admin Components
```jsx
// src/admin/
- AdminLayout.jsx          # Admin-specific layout
- Dashboard.jsx            # Main admin dashboard
- LoginForm.jsx            # Admin login
- PostEditor.jsx           # Post creation/editing
- SlideBuilder.jsx         # Slide creation tool
- MediaLibrary.jsx         # Image management
- SettingsPanel.jsx        # Site settings
```

#### Admin Routing
```jsx
// Protected admin routes
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<Dashboard />} />
  <Route path="posts" element={<PostManager />} />
  <Route path="posts/:id" element={<PostEditor />} />
  <Route path="slides" element={<SlideManager />} />
  <Route path="slides/:id" element={<SlideBuilder />} />
  <Route path="events" element={<EventManager />} />
  <Route path="media" element={<MediaLibrary />} />
  <Route path="settings" element={<SettingsPanel />} />
</Route>
```

## 📋 Implementation Phases

### Phase 1: Authentication & Admin Foundation (Week 1)
1. **Create superuser system**
   - Add role field to User model
   - Create admin rake task
   - Set up admin authentication middleware

2. **Build admin layout**
   - Create AdminLayout component
   - Add admin navigation
   - Style admin interface

3. **Create admin dashboard**
   - Show content statistics
   - Quick actions panel
   - Recent activity feed

### Phase 2: Image Upload System (Week 1-2)
1. **Set up Active Storage**
   - Configure file upload handling
   - Add image optimization gems
   - Create attachment model

2. **Build media library**
   - Upload interface
   - Image browser/selector
   - Delete/organize functionality

3. **API endpoints**
   - POST /api/v1/admin/media (upload)
   - GET /api/v1/admin/media (list)
   - DELETE /api/v1/admin/media/:id

### Phase 3: WYSIWYG Integration (Week 2)
1. **Install TinyMCE**
   ```bash
   npm install @tinymce/tinymce-react
   ```

2. **Create reusable editor component**
   ```jsx
   // components/admin/WYSIWYGEditor.jsx
   import { Editor } from '@tinymce/tinymce-react';
   
   const WYSIWYGEditor = ({ value, onChange, placeholder }) => {
     return (
       <Editor
         apiKey="your-tinymce-api-key" // Free tier available
         value={value}
         onEditorChange={onChange}
         init={{
           height: 400,
           menubar: false,
           plugins: [
             'advlist autolink lists link image charmap print preview anchor',
             'searchreplace visualblocks code fullscreen',
             'insertdatetime media table paste code help wordcount'
           ],
           toolbar: 'undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | image link | removeformat | help',
           images_upload_handler: (blobInfo, success, failure) => {
             // Handle image uploads to your API
             uploadImageToAPI(blobInfo.blob())
               .then(url => success(url))
               .catch(err => failure(err.message));
           }
         }}
       />
     );
   };
   ```

### Phase 4: Content Editors (Week 2-3)
1. **Post Editor**
   - Title, content (WYSIWYG), featured image
   - Publish/draft toggle
   - SEO fields (meta description, slug)
   - Preview functionality

2. **Slide Builder**
   - Different slide templates
   - Background image upload
   - Text overlay controls
   - Duration settings
   - Preview mode

3. **Event Manager**
   - Event details form
   - Date/time picker
   - Image upload
   - Location mapping

### Phase 5: Advanced Features (Week 3-4)
1. **Drag & Drop Reordering**
   - For slides display order
   - For navigation menu items
   - Using react-beautiful-dnd

2. **Bulk Operations**
   - Delete multiple items
   - Bulk publish/unpublish
   - Export/import content

3. **Site Settings**
   - Global site information
   - Contact details
   - Social media links
   - Email settings

## 🛠️ Required Dependencies

### Backend (Rails)
```ruby
# Gemfile additions
gem 'image_processing', '~> 1.2'  # Image optimization
gem 'cloudinary'                  # Cloudinary integration
gem 'mini_magick'                 # Image manipulation
```

### Frontend (React)
```json
{
  "dependencies": {
    "@tinymce/tinymce-react": "^4.3.0",
    "react-beautiful-dnd": "^13.1.1",
    "react-dropzone": "^14.2.3",
    "react-router-dom": "^6.8.1",
    "axios": "^1.3.4",
    "date-fns": "^2.29.3",
    "@cloudinary/react": "^1.13.0",
    "@cloudinary/url-gen": "^1.20.0"
  }
}
```

✅ **Cloudinary packages installed** (React 19 compatible)

## 📦 Cloudinary Integration - ✅ COMPLETED!

### 🥇 **Cloudinary Setup Complete**

**Perfect for PPYC because:**
- ✅ **25 GB storage + 25 GB bandwidth/month** 
- ✅ **Automatic image optimization** (WebP, quality adjustment)
- ✅ **Built-in global CDN**
- ✅ **Dynamic transformations** (resize, crop, compress on-the-fly)
- ✅ **Excellent Rails/React integration**
- ✅ **No credit card required for free tier**

#### ⚠️ NEXT STEP: Add Your Cloud Name

**YOU NEED TO UPDATE THESE FILES:**

1. **Backend:** `ppyc_backend/.env`
   ```
   CLOUDINARY_CLOUD_NAME=your-actual-cloud-name-here
   ```

2. **Frontend:** `ppyc_frontend/.env`
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name-here
   ```

**Find your Cloud Name:** [Cloudinary Dashboard](https://cloudinary.com/console) → Account Details

#### ✅ What's Already Configured

**1. Backend Configuration:** ✅ DONE
```ruby
# ✅ Installed: gem 'cloudinary', 'dotenv-rails'
# ✅ Active Storage configured with Cloudinary service
# ✅ Environment variables setup in .env
# ✅ Models updated with has_one_attached :image

# config/storage.yml - CONFIGURED ✅
cloudinary:
  service: Cloudinary
  cloud_name: <%= ENV['CLOUDINARY_CLOUD_NAME'] %>
  api_key: <%= ENV['CLOUDINARY_API_KEY'] %>
  api_secret: <%= ENV['CLOUDINARY_API_SECRET'] %>

# config/environments/development.rb - CONFIGURED ✅
config.active_storage.service = :cloudinary
```

**2. Model Updates:** ✅ DONE
```ruby
# ✅ CONFIGURED: app/models/post.rb
class Post < ApplicationRecord
  has_one_attached :featured_image  # ✅ ADDED
  # Auto URL generation via Active Storage + Cloudinary
end

# ✅ CONFIGURED: app/models/event.rb
class Event < ApplicationRecord
  has_one_attached :image  # ✅ ADDED
end

# ✅ CONFIGURED: app/models/slide.rb  
class Slide < ApplicationRecord
  has_one_attached :image  # ✅ ADDED
end

# ✅ Controllers automatically return Cloudinary URLs:
# post.featured_image.attached? ? post.featured_image.url : nil
```

**3. Upload Controller:** ✅ DONE
```ruby
# ✅ CREATED: app/controllers/api/v1/admin/images_controller.rb
class Api::V1::Admin::ImagesController < Api::V1::Admin::BaseController
  # POST /api/v1/admin/images - ✅ IMPLEMENTED
  def create
    result = Cloudinary::Uploader.upload(
      image_params[:file],
      folder: "ppyc/#{image_params[:folder] || 'general'}",
      use_filename: true,
      resource_type: :auto
    )
    render json: { success: true, data: result }
  end

  # GET /api/v1/admin/images - ✅ IMPLEMENTED  
  def index
    # Browse Cloudinary media library
  end

  # DELETE /api/v1/admin/images/:public_id - ✅ IMPLEMENTED
  def destroy
    # Remove from Cloudinary
  end
end

# ✅ ROUTES CONFIGURED: config/routes.rb
# resources :images, only: [:create, :index, :destroy]
```

**4. Frontend Integration:** ✅ DONE
```jsx
// ✅ CREATED: src/components/CloudinaryImage.jsx
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';

// ✅ Optimized image display with auto-format/quality
<CloudinaryImage 
  publicId="ppyc/events/party-photo" 
  alt="Event photo"
  width={400} 
  height={300}
  className="rounded-lg shadow-md"
/>

// ✅ CREATED: src/components/ImageUpload.jsx
// Drag & drop upload with progress indicators
<ImageUpload 
  folder="events"
  onUploadSuccess={(data) => console.log('Uploaded:', data.url)}
  onUploadError={(error) => console.error('Upload failed:', error)}
/>

// ✅ PACKAGES INSTALLED:
// @cloudinary/react @cloudinary/url-gen (React 19 compatible)
```

### 🥈 **Alternative: Supabase Storage (Free Tier)**

**Good for simpler needs:**
- ✅ **1 GB storage free**
- ✅ **Built-in CDN**
- ✅ **Simple API**
- ❌ No automatic image optimization
- ❌ Smaller storage limit

#### Supabase Setup
```ruby
# Gemfile
gem 'supabase-ruby'

# config/storage.yml
supabase:
  service: S3
  endpoint: https://your-project.supabase.co/storage/v1/s3
  access_key_id: <%= Rails.application.credentials.dig(:supabase, :access_key_id) %>
  secret_access_key: <%= Rails.application.credentials.dig(:supabase, :secret_access_key) %>
  region: us-east-1
  bucket: ppyc-media
```

### 🥉 **Alternative: ImageKit (Free Tier)**

**Specialized for images:**
- ✅ **20 GB bandwidth/month**
- ✅ **20 GB storage**
- ✅ **Image optimization**
- ✅ **Real-time transformations**

## 💰 **Cost Comparison (Free Tiers)**

| Service | Storage | Bandwidth | Transformations | Best For |
|---------|---------|-----------|-----------------|----------|
| **Cloudinary** | 25 GB | 25 GB/month | ✅ Unlimited | **Recommended** |
| Supabase | 1 GB | Unlimited | ❌ None | Simple needs |
| ImageKit | 20 GB | 20 GB/month | ✅ Unlimited | Image-heavy |
| AWS S3 + CloudFront | 5 GB | 15 GB/month | ❌ Manual | Complex setup |

## 🚀 **Recommended Implementation Plan**

### Phase 1: Cloudinary Setup
1. **Sign up for Cloudinary** (free account)
2. **Add Cloudinary gem** to Rails
3. **Configure credentials** in Rails credentials
4. **Update models** for Cloudinary URLs
5. **Create upload controller** with Cloudinary integration

### Phase 2: Frontend Integration
1. **Install cloudinary-react**
2. **Create MediaLibrary component**
3. **Add image upload to WYSIWYG editor**
4. **Implement image selection in post/slide editors**

### Phase 3: Optimization
1. **Set up automatic transformations**
2. **Implement responsive images**
3. **Add image compression presets**
4. **Create different sizes for different use cases**

## 🎯 **Cloudinary Benefits for PPYC**

### Automatic Optimizations
```jsx
// Automatically serves WebP to modern browsers, JPEG to older ones
<Image cloudName="ppyc" publicId="marina-sunset">
  <Transformation quality="auto" fetchFormat="auto" />
</Image>

// Responsive images for different screen sizes
<Image cloudName="ppyc" publicId="boat-race">
  <Transformation width="auto" crop="scale" responsive />
</Image>

// TV display optimization (large, high quality)
<Image cloudName="ppyc" publicId="slide-background">
  <Transformation width="1920" height="1080" crop="fill" quality="90" />
</Image>
```

### Dynamic Transformations
```jsx
// Create thumbnails on-the-fly
<Transformation width="150" height="150" crop="thumb" gravity="face" />

// Add text overlays for slides
<Transformation overlay="text:Arial_60:Welcome to PPYC" />

// Apply effects
<Transformation effect="sepia" />
```

## 📊 **Expected Usage for PPYC**

- **Storage needed**: ~2-5 GB (hundreds of yacht club photos)
- **Bandwidth**: ~5-10 GB/month (small club website)
- **Transformations**: Heavy use (thumbnails, different sizes, optimization)

**Verdict**: Cloudinary's free tier will easily handle PPYC's needs with room to grow!

## 🔧 **Implementation Priority**

1. **Start with Cloudinary** - Best free option with excellent features
2. **Set up automatic optimization** - WebP conversion, quality adjustment  
3. **Create transformation presets** - Consistent image sizes across site
4. **Implement responsive images** - Fast loading on mobile
5. **Add backup strategy** - Export/import capabilities

This approach will give you professional-grade image delivery that scales with your yacht club's growth!

## 🎨 Admin UI Design

### Color Scheme
- **Primary**: Blue (#2563eb) - Matches yacht club theme
- **Secondary**: Slate (#475569) - Professional admin feel
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

### Layout Structure
```
┌─────────────────────────────────────┐
│ Admin Header (Logo, User, Logout)   │
├─────────┬───────────────────────────┤
│ Sidebar │ Main Content Area         │
│         │                           │
│ - Posts │ ┌─── Editor/Manager ────┐ │
│ - Slides│ │                       │ │
│ - Events│ │   Content Area        │ │
│ - Media │ │                       │ │
│ - Pages │ └───────────────────────┘ │
│ - Settings                          │
└─────────┴───────────────────────────┘
```

## 🚀 Getting Started

### Step 1: Create Superuser
```bash
cd ppyc_backend
ADMIN_EMAIL=your-email@domain.com rails admin:create_superuser
```

### Step 2: Access Admin Panel
- Navigate to `/admin/login` 
- Use the credentials from Step 1
- Start managing your content!

## 📊 Success Metrics

- ✅ **Single user authentication** working
- ✅ **Image uploads** functional
- ✅ **WYSIWYG editing** smooth and responsive
- ✅ **Content management** intuitive and fast
- ✅ **Mobile responsive** admin interface
- ✅ **Data backup/export** capabilities

---

## 🎯 Final Goal

A beautiful, intuitive CMS that allows you to:
1. **Create stunning blog posts** with rich media
2. **Design TV slides** with custom templates
3. **Manage events** with images and details
4. **Upload and organize media** efficiently
5. **Update site content** without touching code

This will give you complete control over your yacht club's digital presence while maintaining the professional, modern aesthetic you've built! 