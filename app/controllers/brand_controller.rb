class BrandController < ApplicationController
  before_action :authenticate_user!
  
  def new
        if current_user.brand.nil?

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
        else
          redirect_to projects_path
        end
    # binding.pry
    
  end

  def create
    brand = Brand.where(:name => params['brand']['brandname'])
    if brand.count == 0
        Brand.create_brand(params,current_user)


         redirect_to projects_path
    else
      flash[:notice] = "Brand name already exist."
      redirect_to new_brand_path
    end
  end
end
