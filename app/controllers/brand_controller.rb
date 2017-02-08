class BrandController < ApplicationController
  before_action :authenticate_user!
  
  def new
    # binding.pry
    @invitations = []
    current_user.inverse_invitations.each do |invitation|
      invite = {
        :id => invitation.id,
        :brand_name => invitation.brand.name,
        :user_name => invitation.user.fullname
      }
      @invitations << invite
    end
  end
end
