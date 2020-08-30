Rails.application.routes.draw do

  #Devise
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks", sessions: "users/sessions" }
  devise_scope :user do
    scope :users, as: :users do
      post 'pre_otp', to: 'users/sessions#pre_otp'
    end
  end
  
  # resource :two_factor
  root to: 'spa#index'
  
  # devise_scope :user do
  #   get 'sign_in', :to => 'devise/sessions#new', :as => :new_user_session
  # delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  # end
	namespace :api do
    resources :two_factors, only: [:show, :update, :create], param: :user_id
    resources :user_info, only: [:index, :show], param: :user_id
    resources :profile, only: [:show, :update], param: :user_id
    resources :guild, only: [:show, :update], param: :user_id
    resources :war, only: [:show], param: :user_id
    resources :war_history, only: [:show], param: :guild_id
    resources :my_friends, only: [:index, :show, :update, :destroy], param: :user_id
    resources :user_status, only: [:show, :update], param: :user_id
    resources :chats, param: :room, only: [:index] do
      resources :chat_messages, only: [:index, :create]
      get "/members", to: 'chat_members#index'
      put "/last_visited", to: 'chats#update_last_visited'
      put "/display", to: "chats#update_display", param: :display
    end
    resources :channels, param: :id, only: [:index, :create, :show] do
      resources :channel_messages, only: [:index, :create]
      get "/members/", to: 'channel_members#index'
      put "/members/:user_id", to: 'channel_members#update'

      delete "/members/:user_id", to: 'channel_members#destroy'
      put "/admins/:user_id", to: 'channel_admins#update'
      delete "/admins/:user_id", to: 'channel_admins#destroy'
      put "/bans/:user_id", to: 'channel_bans#update'
      delete "/bans/:user_id", to: 'channel_bans#destroy'
      put "/mutes/:user_id", to: 'channel_mutes#update'
      delete "/mutes/:user_id", to: 'channel_mutes#destroy'      

      put "/password/", to: 'channel_password#update'
      delete "/password/", to: 'channel_password#destroy'
      post "/password/", to: 'channel_password#login'

      put "/last_visited", to: 'channels#update_last_visited'
    end
    resources :tournaments, param: :id, only: [:create, :index, :show], format: "json" do
        member do
            put :join
            delete :quit
        end
    end
    resources :matches, param: :id, only: [:index, :create, :show]
  end # namespace api      
end
