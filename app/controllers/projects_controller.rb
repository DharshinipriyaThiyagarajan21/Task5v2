require 'slack-notifier'
class ProjectsController < ApplicationController
  def index
      Proinvite.where(:email => current_user.email,:status => false).each do |i|
        current_user.projects << i.project
        i.update(:status => true)
      end
  end

  def create
    ProjectService.new.create_project(params,current_user)
    render json: {success: true}
  end

  def members
     @members, @add, completed_queue = ProjectService.new.show_members(params,current_user)
  	 render json: {add: @add, members: @members,completed_queue: completed_queue} 
  end


  def add_members
        Project.find_by(:brand_id => params['brandName'])	
  end


  def get
        @projects,@addMembers,@user = ProjectService.new.create_project_details(current_user)
        render json: {projects: @projects, addMembers: @addMembers, user: @user}
  end

  def update_task_queue
    task_queue = Task.where(:project_id => params['currentProject']['id'], :taken => false)
    render json: {task_queue: task_queue}.to_json(:include => [ :users ,:assigned])
  end


  def add_task_queue
     ProjectService.new.add_task_queue(params,current_user)
    render json: {success: true}
  end

  def mytask
       mytask = current_user.tasks
       render json: {mytask: mytask}
  end


  def update_members
        members = ProjectService.new.update_members(params,current_user)
        render json: {members: members}
  end


  def take_task
    estimated_time = current_user.tasks.where(:project_id => params['currentProject']['id'],:taken => true).pluck(:estimated_time)
    estimated_time << params['estimated_time'].to_i
    completed_time = current_user.tasks.where(:project_id => params['currentProject']['id'],:completed => true).pluck(:estimated_time)
    estimated_time = estimated_time - completed_time
    if estimated_time.sum < 12
        Task.find(params['task_id']).update(:taken => true, :day => params['day_num'], :estimated_time => params['estimated_time'], :user_ids => current_user.id)  
    end
    render json: {success: true}
  end

  def update_time
    estimated_time = current_user.tasks.where(:project_id => params['currentProject']['id'],:taken => true).pluck(:estimated_time)
    completed_time = current_user.tasks.where(:project_id => params['currentProject']['id'],:completed => true).pluck(:completed_time)
    estimated_time = estimated_time.sum
    completed_time = completed_time.sum
    render json: {estimated_time: estimated_time, completed_time: completed_time}
  end


  def display_task
    zero,one,two,three,four,completed_queue = ProjectService.new.display_task(params,current_user) 
    render json: {zero: zero, one: one, two:two, three:three, four:four, completed_queue: completed_queue}.to_json(:include => [{:users => {:only => :username}},{:assigned => {:only => :username}}])
  end


  def completed
     Task.find(params['task_id']).update(:completed => true, :completed_time => params['completed_time'])
     taskname = Task.find(params['task_id']).name

      render json: {taskname: taskname}
  end


  def delete_task
    Task.find(params['task_id']).destroy
    render json: {success: true}
  end

  def back_to_add_tasks
        c = Task.find(params['task_id']).backlog_count
        c = c + 1
        Task.find(params['task_id']).update(:taken => false,:day => nil, :estimated_time => nil, :backlog_count => c)
        render json: {success: true}
  end

  def delete_project
    Project.find(params['project_id']).destroy
    render json: {success: true}
  end

  def slackUpdate
    user = current_user.username
    avatar = current_user.avatar
    notifier = Slack::Notifier.new params['currentProject']['hook'] , http_options: { open_timeout: 5 }
  
    notifier.post text: params['hooktype']+"  *"+params['hookname']+"*", username: user, icon_url: avatar

    render json: {success: true}
  end

  def call_edit
    name = Project.find(params['currentProject']['id']).name
    hook = Project.find(params['currentProject']['id']).hook
    render json: {name: name, hook: hook}
  end

  def edit_project
   project = Project.find(params['currentProject']['id']).update(:name => params['projectname'], :hook => params['hook'])
   render json: {project: project}
  end
end