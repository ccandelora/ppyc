class Api::V1::NewsController < Api::V1::BaseController
  def index
    news = Post.published.recent.includes(:author)
    render_success(news.map { |news_item| news_json(news_item) })
  end

  def show
    news_item = Post.published.friendly.find(params[:slug])
    render_success(news_json(news_item))
  rescue ActiveRecord::RecordNotFound
    render_error('News article not found', :not_found)
  end

  private

  def news_json(news_item)
    {
      id: news_item.id,
      title: news_item.title,
      content: news_item.content,
      slug: news_item.slug,
      published_at: news_item.published_at,
      featured_image_url: news_item.featured_image.attached? ? news_item.featured_image.url : nil,
      author: {
        email: news_item.author.email
      }
    }
  end
end
