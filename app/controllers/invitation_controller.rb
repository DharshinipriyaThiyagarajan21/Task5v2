class InvitationController < ApplicationController
  def edit
    invite  = current_user.inverse_invitations.find(params[:id])
    if invite.nil?
      flash[:error] = "Wrong Invite"
      redirect_to new_brand_path
    else
      current_user.inverse_invitations.update_all(:status => "rejected")
      invite.update_attributes(:status => "accepted")
      current_user.update_attributes(:brand_id => invite.brand_id)
      redirect_to projects_path
    end
  end
end
