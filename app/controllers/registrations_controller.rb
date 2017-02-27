class RegistrationsController < Devise::RegistrationsController
	def new
    super  
  end

  def create
      if User.where(:email => params['user']['email']).present?
        # render html: "<script>alert('No users!')</script>".html_safe
        redirect_to action: "new"
      else
        super
        # u=User.new
        # u.avatar = params[:avatar]
        # u.save!
        # u.avatar.url
        # u.avatar.current_path
        # u.avatar_identifier
        RegistrationService.new.invite_user(params,current_user)
      end
  end
  def update
    super
  end


end
