class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?

  def configure_permitted_parameters
    # devise_parameter_sanitizer.for(:sign_up) { |u| u.permit(:email, :password, :name, :mobile,:panNumber,:gender,:maritalStatus,:ifsccode,:accountno) }
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :username, :avatar])
  end

  def after_sign_in_path_for(resource)
    if current_user.brand.nil?
      new_brand_path
    else
      projects_path
    end
  end

   def after_sign_up_path_for(resource)
      new_brand_path
   end
end