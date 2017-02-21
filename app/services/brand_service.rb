class BrandService
	def user_without_brand(current_user) 
		      invitations = []
	          user = User.all.where(:brand_id => nil) - [current_user]
	          current_user.inverse_invitations.each do |invitation|
	          invite = {
	            :id => invitation.id,
	            :brand_name => invitation.brand.name,
	            :user_name => invitation.user.username
	           }
	            invitations << invite
	           end
	           return [user,invitations]
	end
	def create_brand(params,current_user)
		brand = Brand.create(:name => params['brand']['brandname'])
        Brand.find(brand.id).histories.create(:user_id => current_user.id, :action => 'created brand', :notify => false)
        current_user.inverse_invitations.update_all(:status => "rejected")
        current_user.brand = brand
        current_user.save
        if params['brand']['selectedUser'].present? 
          params['brand']['selectedUser'].each do |invite|
            user = User.find_by(:email => invite)
            brand = Brand.find_by(:name => params['brand']['brandname'])
            if user         
              invitation = Invitation.create(:user_id => current_user.id, :brand_id => brand.id, :invitee_id => user.id, :status => 'pending')
              Invitation.find(invitation.id).histories.create(:user_id => current_user.id, :action => 'invited user', :notify => false)
            else
              invite = Invite.create(:user_id => current_user.id, :brand_id => brand.id, :email => invite, :status => false)
              Invite.find(invite.id).histories.create(:user_id => current_user.id, :action => 'invited user', :notify => false)
            end
         end
        end      
	end
end