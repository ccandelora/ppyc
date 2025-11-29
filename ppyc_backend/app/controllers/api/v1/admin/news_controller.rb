class Api::V1::Admin::NewsController < Api::V1::Admin::BaseController
  before_action :set_news_item, only: [:show, :update, :destroy]

  def index
    news = Post.includes(:author).order(created_at: :desc)
    render_success(news.map { |news_item| admin_news_json(news_item) })
  end

  def show
    render_success(admin_news_json(@news_item))
  end

  def create
    news_item = current_user.posts.build(news_params)

    if news_item.save
      render_success(admin_news_json(news_item), :created)
    else
      render_error(news_item.errors.full_messages.join(', '))
    end
  end

  def update
    if @news_item.update(news_params)
      render_success(admin_news_json(@news_item))
    else
      render_error(@news_item.errors.full_messages.join(', '))
    end
  end

  def destroy
    @news_item.destroy
    render_success({ message: 'News article deleted successfully' })
  end

  private

  def set_news_item
    @news_item = Post.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_error('News article not found', :not_found)
  end

  def news_params
    params.require(:news).permit(:title, :content, :published_at, :featured_image, :featured_image_url)
  end

  def admin_news_json(news_item)
    {
      id: news_item.id,
      title: news_item.title,
      content: news_item.content,
      slug: news_item.slug,
      published_at: news_item.published_at,
      featured_image_url: news_item.featured_image_url.presence || (news_item.featured_image.attached? ? news_item.featured_image.url : nil),
      created_at: news_item.created_at,
      updated_at: news_item.updated_at,
      author: news_item.author ? {
        id: news_item.author.id,
        email: news_item.author.email
      } : nil
    }
  end
end
