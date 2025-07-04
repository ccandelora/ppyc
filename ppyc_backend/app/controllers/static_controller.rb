class StaticController < ActionController::Base
  def index
    # This renders the main index.html file from your React build
    render file: Rails.root.join('public', 'index.html'), layout: false
  end
end
