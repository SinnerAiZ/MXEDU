Rails.application.routes.draw do

  scope module: :index do
    get 'login' => 'session#index', as: :login
    post 'login' => 'session#login'
    post 'logout' => 'session#logout'

    resources :users, as: :index_user do
      collection do
        get 'profile' => 'users#show'
      end
    end

    resources :products, as: :index_product

    #user center
    scope 'ucenter' do
        # orders
        get 'orders' => 'user_center#orders'
        get 'orders/:id' => 'user_center#order'

        #histories
        get 'histories' => 'user_center#histories'
        get 'histories/:id' => 'user_center#histories'
    end

  end

  namespace :manage do
    resources :admins

    # session
    get 'login' => 'session#index'
    post 'login' => 'session#login'
    post 'logout' => 'session#logout'

    # orders
    get 'orders' => 'orders#index'
    get 'orders/:id' => 'orders#show'

    #histories
    get 'histories' => 'histories#index'
    get 'histories/:id' => 'histories#show'
  end

  root 'index/main#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
