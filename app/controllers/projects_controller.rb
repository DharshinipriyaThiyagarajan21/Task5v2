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
        @addMembers = Project.user_with_brand(current_user)
        render json: {projects: @projects, addMembers: @addMembers}
  end
  def add_task_queue
       project = Project.find(params['currentProject']['id']).tasks.create(:name => params['task'],:project_id => params['currentProject']['id'],:git_status => false,:backlog_count => 0,:assigned_id => current_user.id,:taken => false, :completed => false)
       Task.find(project).histories.create(:action => "task added", :user_id => current_user.id, :notify => false) 
        params[:assignedToDetails].each do |detail|
          project.users << User.find(params[:assignedToDetails][detail]['id'])
        end
        task_queue = Task.find_by(:project_id => params['currentProject']['id'], :taken => false)
       render json: {task_queue: task_queue}
    
  end
  def mytask
       mytask = current_user.tasks
       render json: {mytask: mytask}
  end
  def update_members
    if params['removeMembers'].present?
       params['removeMembers'].each do |removeUser|
            user = User.find_by(:email => removeUser)
            member = User.find(user.id).projects.destroy(params['project']['id'])
            Project.find(member).histories.create(:action => 'removed', :user_id => user.id, :notify => false)
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
  def take_task
    Task.find(params['currentTask']['id'].update(:taken => true, :day => params['day'], :estimated_time => params['estimated_time']))
  end
  def display_task
    zero = current_user.tasks.where(:project_id => params['currentProject']['id'],:day => 0)
    one = current_user.tasks.where(:project_id => params['currentProject']['id'],:day => 1)
    two = current_user.tasks.where(:project_id => params['currentProject']['id'],:day => 2)
    three = current_user.tasks.where(:project_id => params['currentProject']['id'],:day => 3)
    four = current_user.tasks.where(:project_id => params['currentProject']['id'],:day => 4)
    five = current_user.tasks.where(:project_id => params['currentProject']['id'],:day => 5)
    render json: {zero: zero, one: one, two:two, three:three, four:four, five:five}
  end

  def completed
     Task.find(params['currentTask']['id']).update(:completed => true, :completed_time => params['completed_time'])
  end
end