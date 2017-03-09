class RegistrationsController < Devise::RegistrationsController
	def new
    super  
  end
  def create
      #Check whether user is already present in table
      if User.where(:email => params['user']['email']).present?
        flash[:email] = "Email already registered. Please sign-up with different email" 
        redirect_to action: "new"
      else
        flash[:success] = "Please verify your email." 
        super
      end
  end
  def update
    super
  end
end
