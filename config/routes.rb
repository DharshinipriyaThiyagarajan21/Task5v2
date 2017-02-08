Rails.application.routes.draw do

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  devise_for :users

  root to: 'brand#new'

  resources :invitation
  resources :brand
  resources :projects
end
