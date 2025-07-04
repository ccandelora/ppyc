class Api::V1::Admin::PostsController < Api::V1::Admin::BaseController
  before_action :set_post, only: [:show, :update, :destroy]

  def index
    posts = Post.includes(:author).order(created_at: :desc)
    render_success(posts.map { |post| admin_post_json(post) })
  end

  def show
    render_success(admin_post_json(@post))
  end

  def create
    post = current_user.posts.build(post_params)

    if post.save
      render_success(admin_post_json(post), :created)
    else
      render_error(post.errors.full_messages.join(', '))
    end
  end

  def update
    if @post.update(post_params)
      render_success(admin_post_json(@post))
    else
      render_error(@post.errors.full_messages.join(', '))
    end
  end

  def destroy
    @post.destroy
    render_success({ message: 'Post deleted successfully' })
  end

  private

  def set_post
    @post = Post.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_error('Post not found', :not_found)
  end

  def post_params
    params.require(:post).permit(:title, :content, :published_at, :featured_image, :featured_image_url)
  end

  def admin_post_json(post)
    {
      id: post.id,
      title: post.title,
      content: post.content,
      slug: post.slug,
      published_at: post.published_at,
      featured_image_url: post.featured_image_url.presence || (post.featured_image.attached? ? post.featured_image.url : nil),
      created_at: post.created_at,
      updated_at: post.updated_at,
      author: {
        id: post.author.id,
        email: post.author.email
      }
    }
  end
end
