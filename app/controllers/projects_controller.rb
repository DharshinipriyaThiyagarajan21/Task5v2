require 'slack-notifier'
class ProjectsController < ApplicationController
  # It will add the project to the user if anyone invited
  def index
      Proinvite.where(:email => current_user.email,:status => false).each do |i|
        current_user.projects << i.project
        i.update(:status => true)
      end
  end
  # Create the new project
  def create
    ProjectService.new.create_project(params,current_user)
    render json: {success: true}
  end

  # this gives the details of the selected project
  def members
     @members, @add, completed_queue, @nonAdmins = ProjectService.new.show_members(params,current_user)
  	 render json: {add: @add, members: @members,completed_queue: completed_queue, nonAdmins: @nonAdmins} 
  end

  # gives the list of projects once the page is loaded
  def get
        @projects,@addMembers,@user,@admins = ProjectService.new.create_project_details(current_user)  
        render json: {projects: @projects, addMembers: @addMembers, user: @user, admins: @admins}
  end

  # update active task queue
  def update_task_queue
    user_task_queue = current_user.tasks.where(:project_id => params['currentProject']['id'],:taken => false)
    task_queue = Task.where(:project_id => params['currentProject']['id'], :taken => false) - user_task_queue
    total_task = Task.where(:project_id => params['currentProject']['id'])
    render json: {task_queue: task_queue,user_task_queue: user_task_queue, total_task: total_task}.to_json(:include => [ :users ,:assigned, :project])
  end

  #add new task
  def add_task_queue
     ProjectService.new.add_task_queue(params,current_user)
    render json: {success: true}
  end

  #gives all the tasks of the current users 
  def mytask
       mytask = current_user.tasks.where(:completed => false, :taken => true)
       completed_tasks = current_user.tasks.where(:completed => true)
       render json: {mytask: mytask, completed_tasks: completed_tasks}.to_json(:include => [ :users ,:assigned, :project])
  end

  #add members to project
  def update_members
        members = ProjectService.new.update_members(params,current_user)
        render json: {members: members}
  end

  # take task from active queue
  def take_task
    estimated_time = current_user.tasks.where(:project_id => params['currentProject']['id'],:taken => true).pluck(:estimated_time)
    estimated_time << params['estimated_time'].to_i
    completed_time = current_user.tasks.where(:project_id => params['currentProject']['id'],:completed => true).pluck(:estimated_time)
    total_time = estimated_time.sum - completed_time.sum
    if total_time < 12
        Task.find(params['task_id']).update(:taken => true, :day => params['day_num'], :estimated_time => params['estimated_time'], :user_ids => current_user.id)  
        estimated=Task.find(params['task_id']).estimated_time
    end
    render json: {success: true,estimated_time: estimated_time,estimated: estimated}
  end


  # display the tasks day wise
  def display_task
    zero,one,two,three,four,completed_queue = ProjectService.new.display_task(params,current_user) 
    render json: {zero: zero, one: one, two:two, three:three, four:four, completed_queue: completed_queue}.to_json(:include => [{:users => {:only => :username}},{:assigned => {:only => :username}}])
  end

  # completed task
  def completed
     Task.find(params['task_id']).update(:completed => true, :completed_time => params['completed_time'])
     taskname = Task.find(params['task_id']).name
      render json: {taskname: taskname}
  end

  # delete a task from active task queue
  def delete_task
    Task.find(params['task_id']).destroy
    render json: {success: true}
  end
  # send back task from taken task to active task
  def back_to_add_tasks
        count = Task.find(params['task_id']).backlog_count
        count = count + 1
        Task.find(params['task_id']).update(:taken => false,:day => nil, :estimated_time => nil, :backlog_count => count)
        render json: {success: true}
  end
  #delete the complete project if he is a admin
  def delete_project
    Task.where(:project_id => params['project_id']).each do |delete|
      delete.destroy
    end
    Project.find(params['project_id']).destroy
    render json: {success: true}
  end

  #update status to the slack channel
  def slackUpdate
    user = current_user.username
    avatar = current_user.avatar
    if params['currentProject']['hook'].present?
      notifier = Slack::Notifier.new params['currentProject']['hook'] , http_options: { open_timeout: 5 }
      notifier.post text: params['hooktype']+"  *"+params['hookname']+"*", username: user, icon_url: avatar
    end
    render json: {success: true}
  end

  #get the details of the project
  def call_edit
    name = Project.find(params['currentProject']['id']).name
    hook = Project.find(params['currentProject']['id']).hook
    render json: {name: name, hook: hook}
  end

  #edit the project details
  def edit_project
   project = Project.find(params['currentProject']['id']).update(:name => params['projectname'], :hook => params['hook'])
   proadmin = Proadmin.find_by(:project_id => params['currentProject']['id'])
     params['admins'].each do|admin|
          proadmin.users << User.find_by(:email => admin)
     end
   render json: {project: project}
  end
  
  #Invite a new user to Brand
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

  # def add_direct_task
  #    estimated_time = current_user.tasks.where(:project_id => params['currentProject']['id'],:taken => true).pluck(:estimated_time)
  #   estimated_time << params['estimated_time'].to_i
  #   completed_time = current_user.tasks.where(:project_id => params['currentProject']['id'],:completed => true).pluck(:estimated_time)
  #   total_time = estimated_time.sum - completed_time.sum
  #   if total_time < 12
  #     Project.find(params['currentProject']['id']).tasks.create(:name => params['task'],:project_id => params['currentProject']['id'],:git_status => false,:backlog_count => 0,:assigned_id => current_user.id,:taken => true, :completed => false,:estimated_time => params['estimated_time'],:day => params['day'],:user_ids => current_user.id)
  #   end
  #   render json: {success: true,estimated_time: estimated_time}
  # end

  def mytaskCount

    mytask = current_user.tasks.where(:completed => false, :taken => true)
    render json: {mytask: mytask}
  end

  def add_direct_task
    estimated_time = current_user.tasks.where(:project_id => params['currentProject']['id'],:taken => true).pluck(:estimated_time)
   estimated_time << params['estimated_time'].to_i
   completed_time = current_user.tasks.where(:project_id => params['currentProject']['id'],:completed => true).pluck(:estimated_time)
   total_time = estimated_time.sum - completed_time.sum

   if total_time < 12
     Project.find(params['currentProject']['id']).tasks.create(:name => params['task'],:project_id => params['currentProject']['id'],:git_status => false,:backlog_count => 0,:assigned_id => current_user.id,:taken => true, :completed => false,:estimated_time => params['estimated_time'],:day => params['day'],:user_ids => current_user.id)
     time=Task.where(:name => params['task'],:project_id => params['currentProject']['id']).pluck(:id)
     total_times=Task.find(time.first).estimated_time 
     project_name=Task.find(time.first).name
   end
   render json: {success: true,estimated_time: estimated_time,total_times: total_times,project_name: project_name}
 end
end