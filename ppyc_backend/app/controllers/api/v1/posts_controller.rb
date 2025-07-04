class Api::V1::PostsController < Api::V1::BaseController
  def index
    posts = Post.published.recent.includes(:author)
    render_success(posts.map { |post| post_json(post) })
  end

  def show
    post = Post.published.friendly.find(params[:slug])
    render_success(post_json(post))
  rescue ActiveRecord::RecordNotFound
    render_error('Post not found', :not_found)
  end

  private

  def post_json(post)
    {
      id: post.id,
      title: post.title,
      content: post.content,
      slug: post.slug,
      published_at: post.published_at,
      featured_image_url: post.featured_image.attached? ? post.featured_image.url : nil,
      author: {
        email: post.author.email
      }
    }
  end
end
