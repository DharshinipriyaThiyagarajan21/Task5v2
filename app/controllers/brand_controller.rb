class BrandController < ApplicationController
  before_action :authenticate_user!
  
  def new
        if current_user.brand.nil?
          RegistrationService.new.invite_user(current_user)
          @invitations = BrandService.new.show_invitations(current_user)
        else
          redirect_to projects_path
        end
  end

  def create
    brand = Brand.where(:name => params['brand']['brandname'])
    if brand.count == 0
         BrandService.new.create_brand(params,current_user)
         redirect_to projects_path
    else
      flash[:notice] = "Brand name already exist."
      redirect_to new_brand_path
    end
  end
end
