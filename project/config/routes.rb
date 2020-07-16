Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root "spa#index"
  get 'callback' => "sessions#callback"
  post 'login' => "sessions#create"
  delete 'logout' => "sessions#destroy"
end
