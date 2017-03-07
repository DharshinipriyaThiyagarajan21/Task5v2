class InvitationService
	def accept_invitation(invite,current_user)
	  current_user.inverse_invitations.update_all(:status => "rejected")
      invite.update_attributes(:status => "accepted")
      Invitation.find(invite).histories.create(:action => 'accepted', :user_id => current_user.id, :notify => false)
      current_user.update_attributes(:brand_id => invite.brand_id)
	end
end