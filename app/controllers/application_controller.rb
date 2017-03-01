class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :username, :avatar])
  end 

  # def after_sign_in_path_for(resource)
  #   if current_user.brand.nil?
  #     new_brand_path
  #   else
  #     projects_path
  #   end
  # end

   # def after_sign_up_path_for(resource)
   #    new_user_session_path
   #    # flash[:notice] = "Please verify email to continue" 

   # end
end