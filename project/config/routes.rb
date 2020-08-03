Rails.application.routes.draw do
  devise_for :users, :controllers => { omniauth_callbacks: 'users/omniauth_callbacks' }

  root to: 'spa#index'
  # devise_scope :user do
  #   get 'sign_in', :to => 'devise/sessions#new', :as => :new_user_session
    # delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  # end
  namespace :api do
    resources :user_info, only: [:index, :show], param: :user_id
    resources :profile, only: [:show, :update], param: :user_id
    resources :my_friends, only: [:index, :show, :update, :destroy], param: :user_id
  end
end
