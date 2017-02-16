class RegistrationsController < Devise::RegistrationsController
	def new
    super  
  end

  def create
      super
      RegistrationService.new.invite_user(params,current_user)
  end
  def update
    super
  end


end
