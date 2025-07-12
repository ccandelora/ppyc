Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/").
  # This serves the main index.html file for your React application.
  root 'static#index'

  namespace :api do
    namespace :v1 do
      # Authentication endpoints
      post 'auth/login', to: 'auth#create'
      get 'auth/me', to: 'auth#show'
      delete 'auth/logout', to: 'auth#destroy'

      # Public endpoints (no authentication required)
      resources :news, only: [:index, :show], param: :slug
      resources :events, only: [:index, :show], param: :id
      resources :pages, only: [:show], param: :slug
      resources :slides, only: [:index]

      # Weather endpoints
      namespace :weather do
        get :current
        get :forecast
        get :marine
      end

      # Admin endpoints (authentication required)
      namespace :admin do
        resources :news
        resources :events
        resources :pages
        resources :slides do
          collection do
            patch :reorder
          end
        end

        # User management endpoints
        resources :users

        # Image management endpoints
        resources :images, only: [:create, :index, :destroy] do
          collection do
            get :search
            get :all
          end
        end
      end
    end
  end

  # This is a "catch-all" route.
  # It sends any other non-API requests to the React app's entry point.
  # This allows React Router to handle front-end routing for things like
  # /login or /about, even on a page refresh.
  get '*path', to: 'static#index', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
