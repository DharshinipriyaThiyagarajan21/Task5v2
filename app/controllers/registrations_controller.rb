class RegistrationsController < Devise::RegistrationsController
	def new
    super
  end

  def create
      super
      Invite.where(:email => params[:user][:email]).where(:status => false).each do |invite|
      	Invitation.create(:brand_id => invite.brand_id, :user_id => invite.user_id, :invitee_id => current_user.id, :status => 'pending')
      	invite.update_attributes(:status => true)
      end
  end

  def update
    super
  end
end
