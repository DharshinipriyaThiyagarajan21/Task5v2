class ConfirmationsController < Devise::ConfirmationsController
  private
  def after_confirmation_path_for(resource_name, resource)
  	# flash[:verified] = "Verified Successfully! Please login to continue." 
    new_user_session_path
  end
end