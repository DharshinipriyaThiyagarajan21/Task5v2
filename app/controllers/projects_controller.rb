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
        task_queue = Project.find(params['projectname']['id']).tasks
        render json: {add: @add, members: @members, task_queue: task_queue } 
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
       project = Project.find(params['currentProject']['id']).tasks.create(:name => params['task'],:project_id => params['currentProject']['id'],:git_status => false,:backlog_count => 0,:assigned_id => current_user.id,:taken => false, :completed => false)
        params[:assignedToDetails].each do |detail|
          project.users << User.find(params[:assignedToDetails][detail]['id'])
     
       task_queue = Project.find(params['currentProject']['id']).tasks
       render json: {task_queue: task_queue}




      end


  end
  def mytask
       mytask = current_user.tasks
       render json: {mytask: mytask}
  end
  def update_members
    if params['removeMembers'].present?
       params['removeMembers'].each do |removeUser|
            user = User.find_by(:email => removeUser)
            User.find(user.id).projects.destroy(params['project']['id'])
        end
    end
        params['addMembers'].each do |addUser|
            user = User.find_by(:email => addUser)
            project = Project.find(params['project']['id'])
            user.projects << project
        end

        members = Project.find_by(:id => params['project']['id']).users
        render json: {members: members}


  end

end



