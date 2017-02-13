Rails.application.routes.draw do

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  devise_for :users, :controllers => {:registrations => "registrations"}

  root to: 'brand#new'

  resources :invitation
  resources :brand
  resources :projects
end
