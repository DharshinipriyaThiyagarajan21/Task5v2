class BrandController < ApplicationController
  before_action :authenticate_user!
  
  def new
    # binding.pry
    @invitations = []
    @user = User.all.where(:brand_id => nil)
    current_user.inverse_invitations.each do |invitation|
      invite = {
        :id => invitation.id,
        :brand_name => invitation.brand.name,
        :user_name => invitation.user.username
      }
      @invitations << invite
    end
  end

  def create
    brand = Brand.where(:name => params['brand']['brandname'])
    if brand.count == 0
      brand = Brand.create(:name => params['brand']['brandname'])
      current_user.brand = brand
      current_user.save
      params['brand']['selectedUser'].each do |invite|
        user = User.find_by(:email => invite)
        brand = Brand.find_by(:name => params['brand']['brandname'])
        Invitation.create(:user_id => current_user.id, :brand_id => brand.id, :invitee_id => user.id, :status => 'pending')
      end
      redirect_to projects_path
    else
      flash[:notice] = "Brand name already exist."
      redirect_to new_brand_path
    end
  end
end
