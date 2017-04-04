class ProjectService
	def create_project(params,current_user)
		project = current_user.projects.create(:name => params['projectname'],:brand_id => current_user.brand_id,:hook => params['hook'])  
		admin = Proadmin.create(:project_id => project.id)
		admin.users << current_user	
		Project.find(project).histories.create(:action => "created", :user_id => current_user.id, :notify => false)    
		params['memberlist'].each do |addUser|
			user = User.find_by(:email => addUser)
			if user.present?
				user.projects << project
				Project.find(project).histories.create(:action => "added", :user_id => user.id, :notify => false)
			else
				proinvite = Proinvite.create(:user_id => current_user.id, :status => false, :email => addUser, :project_id => project.id)
			end
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

	def show_members(params,current_user)
		@members = Project.find_by(:id => params['currentProject']['id']).users
		add = User.where(:brand_id => current_user.brand_id)
		@add = add - @members
		completed_queue = Task.where(:project_id => params['currentProject']['id'], :completed => true)
		@nonAdmins = @members - Proadmin.find_by(:project_id => params['currentProject']['id']).users
		return [@members,@add,completed_queue,@nonAdmins]
	end

	def create_project_details(current_user)
		@projects = current_user.projects.all
		@admins = current_user.proadmins.all
		@addMembers = User.where(:brand_id => current_user.brand_id).where.not(:id => current_user.id)

		@user = current_user
		return [@projects,@addMembers,@user,@admins]

	end

	def add_task_queue(params,current_user)
		project = Project.find(params['currentProject']['id']).tasks.create(:name => params['task'],:project_id => params['currentProject']['id'],:git_status => false,:backlog_count => 0,:assigned_id => current_user.id,:taken => false, :completed => false)
		Task.find(project).histories.create(:action => "task added", :user_id => current_user.id, :notify => false) 
		if params[:assignedToDetails].present?
			params[:assignedToDetails].each do |detail|
				project.users << User.find(detail['id'])
			end
		end

	end

	def update_members(params,current_user)
		if params['removeMembers'].present?
			params['removeMembers'].each do |removeUser|
				user = User.find_by(:email => removeUser)
				member = User.find(user.id).projects.destroy(params['project']['id'])
	            # Project.find(member).histories.create(:action => 'removed', :user_id => user.id, :notify => false)
	        end
	    end
	    if params['addMembers'].present?
	    	params['addMembers'].each do |addUser|
	    		user = User.find_by(:email => addUser)
	    		if user.present?	            
	    			project = Project.find(params['project']['id'])
	    			user.projects << project
	    		else
	    			proinvite = Proinvite.create(:user_id => current_user.id, :status => false, :email => addUser, :project_id => params['project']['id'])
	    		end
	    	end
	    end
	    members = Project.find_by(:id => params['project']['id']).users
	    return members
	end

	def display_task(params,current_user)
		zero = current_user.tasks.where(:project_id => params['currentProject']['id'],:day => 0,:completed => false)
		one = current_user.tasks.where(:project_id => params['currentProject']['id'],:day => 1,:completed => false)
		two = current_user.tasks.where(:project_id => params['currentProject']['id'],:day => 2,:completed => false)
		three = current_user.tasks.where(:project_id => params['currentProject']['id'],:day => 3,:completed => false)
		four = current_user.tasks.where(:project_id => params['currentProject']['id'],:day => 4,:completed => false)
		completed_queue = Task.where(:project_id => params['currentProject']['id'], :completed => true)
		return [zero,one,two,three,four,completed_queue]
	end


end