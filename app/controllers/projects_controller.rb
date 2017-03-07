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
     @members, @add, completed_queue, @nonAdmins = ProjectService.new.show_members(params,current_user)
  	 render json: {add: @add, members: @members,completed_queue: completed_queue, nonAdmins: @nonAdmins} 
  end


  def add_members
        Project.find_by(:brand_id => params['brandName'])	
  end


  def get
        @projects,@addMembers,@user,@admins = ProjectService.new.create_project_details(current_user)
        render json: {projects: @projects, addMembers: @addMembers, user: @user, admins: @admins.to_json(:include => :users)}
  end

  def update_task_queue
    user_task_queue = current_user.tasks.where(:project_id => params['currentProject']['id'],:taken => false)
    task_queue = Task.where(:project_id => params['currentProject']['id'], :taken => false) - user_task_queue
    total_task = Task.where(:project_id => params['currentProject']['id'])
    render json: {task_queue: task_queue,user_task_queue: user_task_queue, total_task: total_task}.to_json(:include => [ :users ,:assigned, :project])
  end


  def add_task_queue
     ProjectService.new.add_task_queue(params,current_user)
    render json: {success: true}
  end

  def mytask
       mytask = current_user.tasks.where(:completed => false, :taken => true)
       render json: {mytask: mytask}.to_json(:include => [ :users ,:assigned, :project])
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
        count = Task.find(params['task_id']).backlog_count
        count = count + 1
        Task.find(params['task_id']).update(:taken => false,:day => nil, :estimated_time => nil, :backlog_count => count)
        render json: {success: true}
  end

  def delete_project
    Task.where(:project_id => params['project_id']).each do |delete|
      delete.destroy
    end
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
   proadmin = Proadmin.find_by(:project_id => params['currentProject']['id'])
     params['admins'].each do|admin|
          proadmin.users << User.find_by(:email => admin)
     end
   render json: {project: project}
  end

  def invite_brand
  
    if params['invitemembers'].present? 
          params['invitemembers'].each do |invite|
            user = User.find_by(:email => invite)
            brand = Brand.find_by(:id => current_user.brand_id)
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