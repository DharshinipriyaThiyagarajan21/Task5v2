class ProjectService
	def create_project(params,current_user)
		project = current_user.projects.create(:name => params['projectname'],:brand_id => current_user.brand_id,:admin_id => current_user.id)  	
		Project.find(project).histories.create(:action => "created", :user_id => current_user.id, :notify => false)    
  	    params['memberlist'].each do |addUser|
  	    	user = User.find_by(:email => addUser)
  	        user.projects << project
  	        Project.find(project).histories.create(:action => "added", :user_id => user.id, :notify => false)
  	    end
	end

	def update_task_dates
		Task.where(:day => 0).each do |task|
			count = task.backlog_count
			count = count + 1
			task.update(:backlog_count => count, :day => nil, :taken => false)
		end
		Task.where(:day => 1).update(:day => 0)
		Task.where(:day => 2).update(:day => 1)
		Task.where(:day => 3).update(:day => 2)
		Task.where(:day => 4).update(:day => 3)
		Task.where(:day => 5).update(:day => 4)

        
	end
end