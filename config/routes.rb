Rails.application.routes.draw do

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  devise_for :users, :controllers => {:registrations => "registrations"}

  root to: 'brand#new'
  
  resources :invitation
  resources :brand
  resources "projects" do
  collection do
    post 'members'
    get 'get'
    post 'add_members'
    post 'add_task_queue'
    get 'mytask'
  end
end

end
