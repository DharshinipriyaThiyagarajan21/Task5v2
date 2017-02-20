class ProjectService
	def create_project(params,current_user)
		project = current_user.projects.create(:name => params['projectname'],:brand_id => current_user.brand_id)  	
		Project.find(project).histories.create(:action => "created", :user_id => current_user.id, :notify => false)    
  	    params['memberlist'].each do |addUser|
  	    	user = User.find_by(:email => addUser)
  	        user.projects << project
  	        Project.find(project).histories.create(:action => "added", :user_id => user.id, :notify => false)
  	    end
	end
end