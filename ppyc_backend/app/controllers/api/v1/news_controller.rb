class Api::V1::NewsController < Api::V1::BaseController
  def index
    # Get all published posts ordered by publish date
    news = Post.published.recent.includes(:author)

    # Filter out duplicates by keeping the most recent post with the same title
    filtered_news = news.to_a.uniq { |post| post.title.downcase }

    render_success(filtered_news.map { |news_item| news_json(news_item) })
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
      featured_image_url: news_item.featured_image_url,
      author: {
        email: news_item.author.email
      }
    }
  end
end
