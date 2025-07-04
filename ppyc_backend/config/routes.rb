Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    namespace :v1 do
      # Authentication endpoints
      post 'auth/login', to: 'auth#create'
      get 'auth/me', to: 'auth#show'
      delete 'auth/logout', to: 'auth#destroy'

      # Public endpoints (no authentication required)
      resources :posts, only: [:index], param: :slug
      get 'posts/:slug', to: 'posts#show'

      resources :events, only: [:index, :show]

      get 'pages/:slug', to: 'pages#show'

      resources :slides, only: [:index]

      # Weather endpoints (public, no authentication required)
      namespace :weather do
        get :current
        get :forecast
        get :marine
      end

      # Admin endpoints (authentication required)
      namespace :admin do
        resources :posts
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
          end
        end
      end
    end
  end
end
