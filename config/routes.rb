Rails.application.routes.draw do

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  devise_for :users, :controllers => {:registrations => "registrations", confirmations: "confirmations"}

  root to: 'brand#new'
  
  resources :invitation
  resources :brand
  resources :proinvite
  resources :proadmin
  resources "projects" do
  collection do
    post 'members'
    get 'get'
    post 'add_members'
    post 'add_task_queue'
    get 'mytask'
    post 'update_members'
    post 'take_task'
    post 'display_task'
    post 'completed'
    post 'delete_task'
    post 'back_to_add_tasks'
    post 'delete_project'
    post 'update_task_queue'
    post 'update_time'
    post 'slackUpdate'
    post 'call_edit'
    post 'edit_project'
    post 'invite_brand'
  end
end

end
