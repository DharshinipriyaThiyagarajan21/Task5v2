class ProjectService
	def create_project(params,current_user)
		project = current_user.projects.create(:name => params['projectname'],:brand_id => current_user.brand_id)  	    
  	    params['memberlist'].each do |addUser|
  	    	user = User.find_by(:email => addUser)
  	        user.projects << project
  	    end
	end
end