Rails.application.routes.draw do
  #Devise
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks", sessions: "users/sessions" }
  devise_scope :user do
    scope :users, as: :users do
      post 'pre_otp', to: 'users/sessions#pre_otp'
    end
  end

  resource :two_factor
  root to: 'spa#index'

  # devise_scope :user do
  #   get 'sign_in', :to => 'devise/sessions#new', :as => :new_user_session
  # delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  # end
  namespace :api do
    resources :user_info, only: [:index, :show], param: :user_id
    resources :profile, only: [:show, :update], param: :user_id
    resources :my_friends, only: [:index, :show, :update, :destroy], param: :user_id
    resources :user_status, only: [:show, :update], param: :user_id
    resources :chats, param: :room, only: [:index] do
      resources :chat_messages, only: [:index, :create]
      get "/members", to: 'chat_members#index'
    end
    resources :channels, param: :room, only: [:index] do
      put "/last_visited", to: 'channels#update_last_visited'
      put "/display", to: "channels#update_display", param: :display
    end
  end
end
