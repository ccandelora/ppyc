class Api::V1::Admin::ImagesController < Api::V1::Admin::BaseController
  require 'mini_magick'
  require 'set'
  require 'fileutils'

  before_action :ensure_media_management_access

  UPLOAD_DIR = Rails.root.join('public', 'uploads')
  MAX_IMAGE_SIZE = 10.megabytes
  MAX_VIDEO_SIZE = 100.megabytes
  MAX_IMAGE_DIMENSION = 1200 # Resize images to max 1200px on longest side

  # POST /api/v1/admin/images
  def create
    begin
      file = image_params[:file]
      folder = image_params[:folder] || 'general'

      Rails.logger.info "Starting upload for file: #{file&.original_filename}"

      unless file
        render json: { success: false, error: 'No file provided' }, status: :unprocessable_entity
        return
      end

      # Check file size limits
      is_video = file.content_type&.start_with?('video/')
      max_size = is_video ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
      if file.size > max_size
        max_mb = (max_size.to_f / 1.megabyte).round(0)
        actual_mb = (file.size.to_f / 1.megabyte).round(2)
        render json: {
          success: false,
          error: "File size (#{actual_mb}MB) exceeds the #{max_mb}MB limit"
        }, status: :unprocessable_entity
        return
      end

      # Create folder structure
      upload_folder = UPLOAD_DIR.join(folder)
      FileUtils.mkdir_p(upload_folder)

      # Generate unique filename
      ext = File.extname(file.original_filename)
      basename = File.basename(file.original_filename, ext).parameterize
      timestamp = Time.now.to_i
      unique_name = "#{basename}-#{timestamp}"

      if is_video
        # Save video as-is (no processing)
        final_ext = ext.presence || '.mp4'
        final_filename = "#{unique_name}#{final_ext}"
        final_path = upload_folder.join(final_filename)
        File.open(final_path, 'wb') { |f| f.write(file.read) }

        resource_type = 'video'
        width = nil
        height = nil
        format = final_ext.delete('.').downcase
      else
        # Process image: resize and convert to WebP
        image = MiniMagick::Image.read(file)
        original_width = image.width
        original_height = image.height

        # Resize if larger than max dimension
        if original_width > MAX_IMAGE_DIMENSION || original_height > MAX_IMAGE_DIMENSION
          image.resize "#{MAX_IMAGE_DIMENSION}x#{MAX_IMAGE_DIMENSION}>"
        end

        # Set quality and convert to WebP for smaller files
        image.quality '85'
        final_filename = "#{unique_name}.webp"
        final_path = upload_folder.join(final_filename)
        image.format 'webp'
        image.write(final_path)

        resource_type = 'image'
        width = image.width
        height = image.height
        format = 'webp'
      end

      # Build public URL path
      public_id = "#{folder}/#{unique_name}"
      url = "/uploads/#{folder}/#{final_filename}"

      Rails.logger.info "Upload successful: #{public_id} (#{File.size(final_path)} bytes)"

      render json: {
        success: true,
        data: {
          public_id: public_id,
          url: url,
          secure_url: url,
          width: width,
          height: height,
          format: format,
          resource_type: resource_type,
          bytes: File.size(final_path)
        }
      }, status: :created

    rescue => e
      Rails.logger.error "Upload failed: #{e.class}: #{e.message}"
      render json: { success: false, error: e.message }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/admin/images
  def index
    begin
      folder = params[:folder]
      limit = (params[:limit] || 50).to_i
      offset = (params[:cursor] || 0).to_i

      resources = list_files(folder: folder, limit: limit, offset: offset)
      next_cursor = resources.length == limit ? (offset + limit).to_s : nil

      render json: {
        success: true,
        data: {
          resources: resources,
          next_cursor: next_cursor
        }
      }
    rescue => e
      render json: { success: false, error: e.message }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/admin/images/all
  def all
    begin
      folder = params[:folder]
      resources = list_files(folder: folder, limit: nil, offset: 0)

      images_count = resources.count { |r| r[:resource_type] == 'image' }
      videos_count = resources.count { |r| r[:resource_type] == 'video' }
      Rails.logger.info "Media files: #{images_count} images, #{videos_count} videos"

      render json: {
        success: true,
        data: {
          resources: resources,
          total_count: resources.count
        }
      }
    rescue => e
      Rails.logger.error "Failed to fetch media files: #{e.message}"
      render json: { success: false, error: e.message }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/admin/images/search
  def search
    begin
      query = (params[:q] || '').downcase
      folder = params[:folder]
      limit = (params[:limit] || 50).to_i

      resources = list_files(folder: folder, limit: nil, offset: 0)

      if query.present?
        resources = resources.select { |r| r[:public_id].downcase.include?(query) }
      end

      render json: {
        success: true,
        data: {
          resources: resources.first(limit),
          next_cursor: nil
        }
      }
    rescue => e
      render json: { success: false, error: e.message }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/admin/images/:public_id
  def destroy
    begin
      public_id = params[:public_id]

      # Find file matching the public_id
      deleted = false
      Dir.glob(UPLOAD_DIR.join('**', '*')).each do |path|
        next if File.directory?(path)
        relative = Pathname.new(path).relative_path_from(UPLOAD_DIR).to_s
        file_public_id = relative.sub(/\.[^.]+$/, '') # Strip extension
        if file_public_id == public_id
          File.delete(path)
          deleted = true
          Rails.logger.info "Deleted media file: #{path}"
          break
        end
      end

      if deleted
        render json: { success: true, message: 'Media file deleted successfully' }
      else
        render json: { success: false, error: 'File not found' }, status: :not_found
      end
    rescue => e
      render json: { success: false, error: e.message }, status: :unprocessable_entity
    end
  end

  private

  def image_params
    params.permit(:file, :folder, :tags, :context)
  end

  def list_files(folder: nil, limit: nil, offset: 0)
    search_dir = folder.present? ? UPLOAD_DIR.join(folder) : UPLOAD_DIR
    return [] unless Dir.exist?(search_dir)

    files = Dir.glob(search_dir.join('**', '*'))
              .reject { |f| File.directory?(f) }
              .sort_by { |f| -File.mtime(f).to_i } # Newest first

    files = files.drop(offset) if offset > 0
    files = files.first(limit) if limit

    files.map do |path|
      relative = Pathname.new(path).relative_path_from(UPLOAD_DIR).to_s
      ext = File.extname(path).delete('.').downcase
      public_id = relative.sub(/\.[^.]+$/, '')
      is_video = %w[mp4 mov avi mkv webm].include?(ext)

      resource = {
        public_id: public_id,
        url: "/uploads/#{relative}",
        format: ext,
        resource_type: is_video ? 'video' : 'image',
        created_at: File.mtime(path).iso8601,
        bytes: File.size(path)
      }

      # Get image dimensions
      unless is_video
        begin
          img = MiniMagick::Image.open(path)
          resource[:width] = img.width
          resource[:height] = img.height
        rescue
          # Skip dimensions if can't read image
        end
      end

      resource
    end
  end
end
