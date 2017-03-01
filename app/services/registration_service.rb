class RegistrationService
	def invite_user(current_user)
		#User.find(current_user.id).histories.create(:user_id => current_user.id, :action => 'signed up', :notify => false)
        Invite.where(:email => current_user.email).where(:status => false).each do |invite|
        	invitation = Invitation.create(:brand_id => invite.brand_id, :user_id => invite.user_id, :invitee_id => current_user.id, :status => 'pending')
        	invite.update_attributes(:status => true)
        end
	end
end