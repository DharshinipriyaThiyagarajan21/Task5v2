class RegistrationsController < Devise::RegistrationsController
	def new
    super  
  end
  def create
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
