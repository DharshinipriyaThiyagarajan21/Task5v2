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
        :user_name => invitation.user.fullname
      }
      @invitations << invite
    end
  end

  def create
    brand = Brand.where(:name => params["brand_name"])
    if brand.count == 0
      brand = Brand.create(:name => params["brand_name"])
      current_user.brand = brand
      current_user.save
      redirect_to projects_path
    else
      flash[:notice] = "Brand name already exist."
      redirect_to new_brand_path
    end
  end
end
