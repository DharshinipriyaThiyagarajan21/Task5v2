class InvitationController < ApplicationController
  def edit
    invite  = current_user.inverse_invitations.find(params[:id])
    if invite.nil?
      flash[:notice] = "Wrong Invite"
      redirect_to new_brand_path
    else
      InvitationService.new.accept_invitation(invite,current_user)
      redirect_to projects_path
    end
  end
end
