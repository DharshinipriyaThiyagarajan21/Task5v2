class ProjectsController < ApplicationController
  def index
            
        
  end
  def create
    ProjectService.new.create_project(params,current_user)
  end
  def members
  	    @members = Project.find_by(:id => params['projectname']['id']).users
  	    add = User.all
  	    @add = add - @members
        render json: {add: @add, members: @members } 
  end
  def add_members
        Project.find_by(:brand_id => params['brandName'])	
  end
  def get
        @projects = current_user.projects.all
        @addMembers = Project.user_with_brand 
        render json: {projects: @projects, addMembers: @addMembers}
  end
  def add_task_queue
       Project.find(params['currentProject']['id']).tasks.create(:name => params['task'],:project_id => params['currentProject']['id'],:git_status => false,:backlog_count => 0,:assigned_id => current_user.id,:taken => false, :completed => false, :user_ids => 40)     
       task_queue = Project.find(params['currentProject']['id']).tasks
       render json: {task_queue: task_queue}
  end
  def mytask
       binding.pry

  end

end



