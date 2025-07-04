class Api::V1::PagesController < Api::V1::BaseController
  def show
    page = Page.published.friendly.find(params[:slug])
    render_success(page_json(page))
  rescue ActiveRecord::RecordNotFound
    render_error('Page not found', :not_found)
  end

  private

  def page_json(page)
    {
      id: page.id,
      title: page.title,
      slug: page.slug,
      content: page.content
    }
  end
end
