class Api::V1::Admin::ImagesController < Api::V1::Admin::BaseController
  require 'cloudinary/uploader'
  require 'set'

  before_action :ensure_media_management_access

  # POST /api/v1/admin/images
  def create
    begin
      file = image_params[:file]

      Rails.logger.info "🚀 Starting image upload for file: #{file&.original_filename}"
      Rails.logger.info "📁 File size: #{file&.size} bytes (#{(file&.size.to_f / 1.megabyte).round(2)}MB)"
      Rails.logger.info "📄 Content type: #{file&.content_type}"
      Rails.logger.info "📂 Folder: #{image_params[:folder]}"

      # Check file size limits
      max_size = file&.content_type&.start_with?('video/') ? 100.megabytes : 10.megabytes
      if file&.size && file.size > max_size
        max_size_mb = (max_size.to_f / 1.megabyte).round(0)
        actual_size_mb = (file.size.to_f / 1.megabyte).round(2)

        Rails.logger.error "❌ File too large: #{actual_size_mb}MB exceeds #{max_size_mb}MB limit"

        render json: {
          success: false,
          error: "File size (#{actual_size_mb}MB) exceeds the #{max_size_mb}MB limit for #{file.content_type&.start_with?('video/') ? 'videos' : 'images'}"
        }, status: :unprocessable_entity
        return
      end

      # Upload image to Cloudinary using global configuration
      result = Cloudinary::Uploader.upload(
        file,
        folder: "ppyc/#{image_params[:folder] || 'general'}",
        use_filename: true,
        unique_filename: true,
        resource_type: :auto
      )

      Rails.logger.info "✅ Cloudinary upload successful: #{result['public_id']}"

      render json: {
        success: true,
        data: {
          public_id: result['public_id'],
          url: result['secure_url'],
          secure_url: result['secure_url'],
          width: result['width'],
          height: result['height'],
          format: result['format'],
          resource_type: result['resource_type']
        }
      }, status: :created

    rescue => e
      Rails.logger.error "❌ Upload failed with error: #{e.class}: #{e.message}"
      Rails.logger.error "🔍 Backtrace: #{e.backtrace.first(5).join("\n")}"

      render json: {
        success: false,
        error: e.message
      }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/admin/images
  def index
    begin
      folder = params[:folder]

      # Search media files (images & videos) in Cloudinary
      result = Cloudinary::Api.resources(
        type: :upload,
        prefix: folder.present? ? "ppyc/#{folder}" : "ppyc/",
        max_results: params[:limit] || 50,
        next_cursor: params[:cursor]
      )

      render json: {
        success: true,
        data: {
          resources: result['resources'].map do |resource|
            {
              public_id: resource['public_id'],
              url: resource['secure_url'],
              width: resource['width'],
              height: resource['height'],
              format: resource['format'],
              resource_type: resource['resource_type'], # Include resource type (image/video)
              created_at: resource['created_at'],
              bytes: resource['bytes'], # File size for display
              duration: resource['duration'] # Duration for videos
            }
          end,
          next_cursor: result['next_cursor']
        }
      }

    rescue => e
      render json: {
        success: false,
        error: e.message
      }, status: :unprocessable_entity
    end
  end

      # GET /api/v1/admin/images/all
  def all
    begin
      folder = params[:folder]
      all_resources = []
      seen_public_ids = Set.new  # Track public IDs to prevent duplicates

      Rails.logger.info "🔍 Fetching all media files (images & videos) from Cloudinary..."

      # Fetch images first
      image_cursor = nil
      loop do
        result = Cloudinary::Api.resources(
          type: :upload,
          resource_type: :image,
          prefix: folder.present? ? "ppyc/#{folder}" : "ppyc/",
          max_results: 500,
          next_cursor: image_cursor
        )

        # Add unique resources to our collection
        result['resources'].each do |resource|
          unless seen_public_ids.include?(resource['public_id'])
            all_resources << resource
            seen_public_ids.add(resource['public_id'])
          end
        end

        image_cursor = result['next_cursor']
        break if image_cursor.nil?

        Rails.logger.info "📄 Fetched #{all_resources.count} image files so far, continuing..."
      end

      Rails.logger.info "✅ Images fetched: #{all_resources.count}"

      # Fetch videos
      video_cursor = nil
      loop do
        result = Cloudinary::Api.resources(
          type: :upload,
          resource_type: :video,
          prefix: folder.present? ? "ppyc/#{folder}" : "ppyc/",
          max_results: 500,
          next_cursor: video_cursor
        )

        # Add unique resources to our collection
        result['resources'].each do |resource|
          unless seen_public_ids.include?(resource['public_id'])
            all_resources << resource
            seen_public_ids.add(resource['public_id'])
          end
        end

        video_cursor = result['next_cursor']
        break if video_cursor.nil?

        Rails.logger.info "📄 Fetched #{all_resources.count} total media files (including videos) so far, continuing..."
      end

      Rails.logger.info "✅ Total media files fetched: #{all_resources.count}"

      # Log breakdown of media types
      images_count = all_resources.count { |r| r['resource_type'] == 'image' }
      videos_count = all_resources.count { |r| r['resource_type'] == 'video' }
      Rails.logger.info "📊 Media breakdown: #{images_count} images, #{videos_count} videos"

      render json: {
        success: true,
        data: {
          resources: all_resources.map do |resource|
            {
              public_id: resource['public_id'],
              url: resource['secure_url'],
              width: resource['width'],
              height: resource['height'],
              format: resource['format'],
              resource_type: resource['resource_type'], # Include resource type (image/video)
              created_at: resource['created_at'],
              bytes: resource['bytes'], # File size for display
              duration: resource['duration'] # Duration for videos
            }
          end,
          total_count: all_resources.count
        }
      }

    rescue => e
      Rails.logger.error "❌ Failed to fetch all media files: #{e.message}"
      render json: {
        success: false,
        error: e.message
      }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/admin/images/search
  def search
    begin
      search_query = params[:q] || ''
      folder = params[:folder]

      # Build search parameters
      search_params = {
        type: :upload,
        prefix: folder.present? ? "ppyc/#{folder}" : "ppyc/",
        max_results: params[:limit] || 50,
        next_cursor: params[:cursor]
      }

      # Add search expression if query is provided
      if search_query.present?
        search_params[:search] = search_query
      end

      result = Cloudinary::Api.resources(**search_params)

      render json: {
        success: true,
        data: {
          resources: result['resources'].map do |resource|
            {
              public_id: resource['public_id'],
              url: resource['secure_url'],
              width: resource['width'],
              height: resource['height'],
              format: resource['format'],
              resource_type: resource['resource_type'], # Include resource type (image/video)
              created_at: resource['created_at'],
              bytes: resource['bytes'], # File size for display
              duration: resource['duration'] # Duration for videos
            }
          end,
          next_cursor: result['next_cursor']
        }
      }

    rescue => e
      render json: {
        success: false,
        error: e.message
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/admin/images/:public_id
  def destroy
    begin
      public_id = params[:public_id]

      # Try to delete as image first, then as video if that fails
      result = Cloudinary::Uploader.destroy(public_id, resource_type: :image)

      # If image deletion failed, try video deletion
      if result['result'] != 'ok'
        result = Cloudinary::Uploader.destroy(public_id, resource_type: :video)
      end

      if result['result'] == 'ok'
        render json: {
          success: true,
          message: 'Media file deleted successfully'
        }
      else
        render json: {
          success: false,
          error: 'Failed to delete media file'
        }, status: :unprocessable_entity
      end

    rescue => e
      render json: {
        success: false,
        error: e.message
      }, status: :unprocessable_entity
    end
  end

  private

  def image_params
    params.permit(:file, :folder)
  end
end
