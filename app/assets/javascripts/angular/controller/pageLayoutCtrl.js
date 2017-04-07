app.controller('pageLayoutCtrl', function($scope, $filter, $http, ModalService) {

  $scope.todoQueue = [];
  $scope.addTask = "";
  $scope.inputMsg;
  $scope.daySelect = 0;
  $scope.showhide = [1, 0, 0, 0, 0, 0];
  $scope.arrayName = "";
  $scope.mytasks = 1;
  $scope.taskPage = 0;
  $scope.showTask = 0;
  var id = 0;
  var idString = "";
  var id_num = 0;
  $scope.directTask;
  $scope.projectname;
  $scope.nonAdmins;
  $scope.totalCompletedTasks = 0;
  $scope.totalActiveTasksInQueue = 0;
  $scope.projectMembers = [];
  $scope.createproject_memberlist;
  $scope.hook;
  $scope.createproject_responsedata;
  $scope.user;
  $scope.items = [];
  $scope.newAdmin = [];
  $scope.addedTasks = {};
  $scope.addedTasks.task_queue = [];
  $scope.assignedUser = [];
  $scope.tab_days=[]
  $scope.tasks =[];
  $scope.completed;
  $scope.myTaskLength;

  var idString;
  var id_num = 0;
  var tempday = 0;
  var value;
  var weekday = [];
  $scope.showConfirmTime = false;
  $scope.dayselection;
  $scope.draggedTask;
  $scope.days = {};
  $scope.days.one = [];
  $scope.days.two = [];
  $scope.days.three = [];
  $scope.days.four = [];
  $scope.days.five = [];
  $scope.clicked = [];
  $scope.currentProject;
  $scope.uncheck;
  $scope.admins;
  $scope.addAdmins = [];
  $scope.estimateInput=false;
  $scope.time=false;
  var date = new Date();
  weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]


  $scope.initMsgModal = function() {
    $scope.directTask = $scope.inputMsg;
    $scope.inputMsg = '';
    ModalService.showModal({
      templateUrl: 'directMsgpushModal.html.erb',
      scope: $scope,
      controller: function($scope) {
        $scope.onChangeTime_addTask = function() {
          $scope.showConfirmTime = false;
          if ($scope.estimatedTime >= 1 && $scope.estimatedTime <= 5) {
            $scope.showConfirmTime = true;
          } else {
            $scope.showConfirmTime = false;
          }
        };

        $scope.addmsg = function() {
          $scope.$parent.estimatedTime = $scope.estimatedTime;
          $scope.$parent.addMsg();
        }
      }
    }).then(function(modal) {
      modal.element.modal();
    });

  }

  $scope.addMsg = function() {
    var data = {
      currentProject: $scope.currentProject,
      day: $scope.dayselection,
      task: $scope.directTask,
      estimated_time: $scope.estimatedTime
    };
    
    var config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    $http.post('/projects/add_direct_task', data, config).then(function(response) {
      $scope.estimated=response.data.total_times;
      $scope.hooktype = "Added a task";
      $scope.hookname = response.data.project_name;
       console.log($scope.estimated);
        if($scope.estimated!= null) {
          $scope.slackUpdate();
        }
      $scope.update_push_queue();
    });
  }



    // store task details when clicked add
    $scope.addCall = function() {
      if($scope.addTask!="")
      {
        var taskTemp = $scope.addTask;
        var startindex = 0;
        var taskSubstring = "";
        var taskSubstringlen = 0;
        var tempString = "";
        var assignedTo = [];

        for (var i = 0; i < taskTemp.length; i++){
          var flag = false;
          if (taskTemp.charAt(i) == '@') {
            startindex = i;
            for (var j = startindex; j < taskTemp.length; j++) {
              if (taskTemp.charAt(j) == ' ') {
                taskSubstringlen = j;
                flag = true;
                i = j;
                break;
              }
            }
            if (!flag) {
              taskSubstringlen = taskTemp.length;
            }
            taskSubstring = taskTemp.substring(startindex + 1, taskSubstringlen);
            assignedTo.push(taskSubstring);
          }
        }

        for (var i = 0; i < assignedTo.length; i++) {
          taskTemp = taskTemp.replace("@" + assignedTo[i], "");
        }

        $scope.assignedTo_details = [];
        for (var i = 0; i < $scope.assignedUser.length; i++) {
          for (var j = 0; j < $scope.projectMembers.members.length; j++) {
            if ($scope.assignedUser[i] == $scope.projectMembers.members[j].email) {
              $scope.assignedTo_details.push($scope.projectMembers.members[j]);
            }
          }
        }
        var data = {
          currentProject: $scope.currentProject,
          task: taskTemp,
          assignedToDetails: $scope.assignedTo_details
        };

        $scope.assignedUser = [];
        $scope.hookname = taskTemp;
        $scope.hooktype = "Created a task";
        $scope.addTask = "";

        var config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        $http.post('/projects/add_task_queue', data, config).then(function(response) {
          $scope.update_task_queue();
          $scope.slackUpdate();
        });
      }
    };
    


    // Find the days
    $scope.weekdayFinder = function() {
      var tempday = date.getDay();
      for(i=0;i<6;i++){
        $scope.tab_days[i] = weekday[tempday]
        tempday = (tempday+1)%7
      }
    };
    //called when page loads
    $scope.new = function() {
      $scope.myTask(1);
      $scope.initProjModal();

    };
    //change the button color when day is clicked
    $scope.daychange = function(d) {
      $scope.dayselection = d;
      for (var j = 0; j < 6; j++) {
        if (j == $scope.dayselection) {
          $scope.showhide[j] = 1;
          $scope.taskClass = ".tasks" + j;
          $scope.showTask = 0;
          $scope.clicked = ["btn-default"];
          $scope.clicked[j] = "btn-info";
        } else {
          $scope.showhide[j] = 0;
          $scope.showTask = 0;
        }
      }
    };

    //changes the panel for different days
    $scope.changeTask = function(panel) {
      $scope.taskPage = panel;
      $scope.disabled = true;
      if ($scope.taskPage == $scope.mytasks) {
        $scope.myTask(2);
        $scope.showTask = 1;
        $scope.showhide = [0, 0, 0, 0, 0, 0];
        $scope.clicked = ["btn-default"];
      } else {
        $scope.showTask = 0;
      }
    }
    $scope.reinit = function() {
      var idString = "";
      var id_num = 0;
    };


    //  HTTP FUNCTION BEGINS

    // get project list and current user
    $scope.initProjModal = function() {
      $http({
        method: "GET",
        url: "/projects/get"
      }).then(function(response) {
        $scope.createproject_responsedata = response.data;
        $scope.admins = response.data.admins;
        if ($scope.admins != null) {
          for (var i = 0; i < $scope.createproject_responsedata.projects.length; i++) {
            for (var j = 0; j < $scope.admins.length; j++) {
              if ($scope.createproject_responsedata.projects[i].id == $scope.admins[j].project_id) {
                $scope.createproject_responsedata.projects[i].admin = 1;
              }
            }
          }
        }
        $scope.user = response.data.user;
        $scope.profilepic=response.data.user.avatar.thumb.url;
      });
    };
    //creates new project
    $scope.confirmProject = function() {
      var data = {
        projectname: $scope.projectname,
        memberlist: $scope.createproject_memberlist,
        hook: $scope.hook
      };


      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http.post('/projects', data, config).then(function(response) {
          $scope.projectname = '';
          $scope.createproject_memberlist = '';
          $scope.hook = '';
          $scope.initProjModal();
        });
    };

    // display data about selected project 
    $scope.selectProject = function(project) {
      $scope.disabled = false;
      $scope.projectSelected="selected";
      $scope.selected="disselected"
      $scope.adminClear = '';
      var data = {
        currentProject: project
      };
      $scope.currentProject = project;
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http.post('/projects/members', data, config).then(function(response) {
        $scope.items.length = 0;
        $scope.projectMembers = response.data;
        $scope.completed = response.data.completed_queue;
        $scope.nonAdmins = response.data.nonAdmins;
        $scope.newAdmin = [];
        for (var i = 0; i < $scope.nonAdmins.length; i++) {
          $scope.newAdmin.push({
            username: $scope.nonAdmins[i].username,
            imageUrl: $scope.nonAdmins[i].avatar.thumb.url,
            label: $scope.nonAdmins.username + " (" + $scope.nonAdmins[i].email + ")",
            email: $scope.nonAdmins[i].email
          });
        }
        for (var i = 0; i < $scope.projectMembers.members.length; i++) {
          $scope.items.push({
            username: $scope.projectMembers.members[i].username,
            imageUrl: $scope.projectMembers.members[i].avatar.thumb.url,
            label: $scope.projectMembers.members[i].username + " (" + $scope.projectMembers.members[i].email + ")",
            email: $scope.projectMembers.members[i].email
          });
        }
        $scope.completedTasks = response.data.completed_queue;
        $scope.daychange(0);
        $scope.update_push_queue();
      });
      
    };

    //update task queue ie active task
    $scope.update_task_queue = function() {
      var data = {
        currentProject: $scope.currentProject,
      };
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      $http.post('/projects/update_task_queue', data, config).then(function(response) {
        $scope.addedTasks.user_task_queue = response.data.user_task_queue;
        $scope.addedTasks.task_queue = response.data.task_queue;
        $scope.totalActiveTasksInQueue = response.data.total_task.length;
        $scope.estimatedTime='';
        $scope.myTaskCount();
      });
    };
    //Edit the project
    $scope.callEditProject = function() {
      var data = {
        currentProject: $scope.currentProject
      };
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http.post('/projects/call_edit', data, config).then(function(response) {

        $scope.projectname = response.data.name;
        $scope.hook = response.data.hook;
      });
    };

    //update Members
    $scope.updateMembers = function() {
      var data = {
        project: $scope.currentProject,
        addMembers: $scope.memberlist_add,
        removeMembers: $scope.memberlist_remove
      };
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      $http.post('/projects/update_members', data, config).then(function(response) {

        $scope.projectMembers = response.data;
      });
      $scope.memberlist_add = '';
      $scope.memberlist_remove = '';
    };
    //Edit the projects
    $scope.editProject = function() {
      var data = {
        currentProject: $scope.currentProject,
        projectname: $scope.projectname,
        hook: $scope.hook,
        admins: $scope.addAdmins
      };

      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http.post('/projects/edit_project', data, config).then(function(response) {
        $scope.initProjModal();
        $scope.currentProject = response.data.project;
        $scope.selectProject($scope.currentProject);
      });
      $scope.adminClear = '';
      $scope.newAdmin = [];
      $scope.addAdmins = [];
      
    };

    //update added queue
    $scope.update_push_queue = function() {
      var data = {
        currentProject: $scope.currentProject
      };
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http.post('/projects/display_task', data, config).then(function(response) {
        $scope.days.one = response.data.zero;
        $scope.days.two = response.data.one;
        $scope.days.three = response.data.two;
        $scope.days.four = response.data.three;
        $scope.days.five = response.data.four;
        $scope.completed = response.data.completed_queue;
        $scope.totalCompletedTasks = $scope.completed.length;
        value = false
        // $scope.selectProject($scope.currentProject);
        $scope.update_task_queue();
      });
    };

    //delete projects
    $scope.deleteIdFinder = function(event, tempdayID) {
      tempday = tempdayID;
      idString = event.target.id;
      id_num = parseInt(idString.substring(7));

      var data = {
        project_id: id_num,

      };
      var config = {
        headers: {
          'Content-Type': 'application/json;'
        }
      };
      $http.post('/projects/delete_project', data, config).then(function(response) {
        if ($scope.currentProject.id == id_num) {
          $scope.projectMembers = '';
          $scope.addedTasks.task_queue = '';
          $scope.completedTasks = '';
          $scope.createproject_responsedata = '';
          $scope.currentProject.name='';
        }
        $scope.initProjModal(); 
        $scope.update_push_queue();

      });
      
      

    };
    //Select only username in mentions
    $scope.getPeopleText = function(item) {
        // note item.label is sent when the typedText wasn't found
        $scope.assignedUser.push(item.email);
        return '@' + item.username + '';
      };
    //select only user name when adding admin
    $scope.makeAdmin = function(item) {
        // note item.label is sent when the typedText wasn't found
        $scope.addAdmins.push(item.email);
        return '@' + item.username + '';
      };

    // Delete Tasks from TODO-QUEUE
    $scope.deleteTask = function(event) {
      idString = event.target.id;
      id_num = parseInt(idString.substring(7));

      for (var i = 0; i < $scope.todoQueue.length; i++) {
        if ($scope.todoQueue[i].todoTask.id == id_num) {
          $scope.todoQueue.splice(i, 1);
          break;
        }
      }

      var data = {
        task_id: id_num,
        currentProject: $scope.currentProject

      };

      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http.post('/projects/delete_task', data, config).then(function(response) {
        $scope.update_task_queue();
        $scope.reinit();
      });
      
    };

    // Show Confrim Button in ADD TASK TO USER MODAL BASED ON TIME
    $scope.onChangeTime_addTask = function() {
      $scope.showConfirmTime = false;
      if ($scope.estimatedTime >= 1 && $scope.estimatedTime <= 5) {
        $scope.showConfirmTimske = true;
      } else {
        $scope.showConfirmTime = false;
      }
    };
    //trigger the modal when dragged and dropped
    $scope.show = function(x) {
      $scope.draggedTask = x;
      ModalService.showModal({
        templateUrl: 'pushModal.html.erb',
        scope: $scope,
        controller: function($scope){
          $scope.onChangeTime_addTask = function() {
            $scope.showConfirmTime = false;
            if ($scope.estimatedTime >= 1 && $scope.estimatedTime <= 5) {
              $scope.showConfirmTime = true;
            } else {
              $scope.showConfirmTime = false;
            }
          };
          $scope.pushToUser = function(){
            $scope.$parent.estimatedTime = $scope.estimatedTime;
            $scope.$parent.pushintoUser();
          }
        }
      }).then(function(modal) {
        modal.element.modal();
      });

    };
    // Take the task from the active task
    $scope.pushintoUser = function() {
      var data = {
        task_id: $scope.draggedTask.id,
        estimated_time: $scope.estimatedTime,
        day_num: $scope.dayselection,
        currentProject: $scope.currentProject,
      };
      $scope.hooktype = "Added a task";
      $scope.hookname = $scope.draggedTask.name;


      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http.post('/projects/take_task', data, config).then(function(response) {
        $scope.estimated=response.data.estimated;
        if($scope.estimated!= null) {
          $scope.slackUpdate();
        }
        $scope.update_push_queue();
        $scope.reinit();
      });
      
    };
    //gives the total my tasks
    $scope.myTask = function(value) {
     $scope.selected="selected";
     $http({
      method: "GET",
      url: "/projects/mytask"
    }).then(function(response) {
      $scope.tasks = response.data.mytask;
      $scope.completed = response.data.completed_tasks;
      $scope.myTaskLength = $scope.tasks.length;
      if (value == 1) {
        $scope.currentProject = { name: "My tasks" };

        $scope.daychange(0);
        $scope.changeTask(1);

      } else if (value == 2) {
        $scope.currentProject = { name: "My tasks" };
        
      }
      $scope.projectMembers = '';
      $scope.totalCompletedTasks = 0;
      $scope.update_task_queue();
    });
  };
  $scope.myTaskCount = function() {
    $http({
      method: "GET",
      url: "/projects/mytaskCount"
    }).then(function(response) {
      $scope.task = response.data.mytask;
      $scope.myTaskLength = $scope.task.length;
    });
  }
        //trigger completion time modal when checked
        $scope.checked = function(t) {
          $scope.completedtask = t;
          ModalService.showModal({
            templateUrl: 'completeTaskpushModal.html.erb',
            scope: $scope,
            controller: function($scope){
              $scope.onChangeTime_completeTask = function() {
                $scope.showConfirmTime = false;
                if ($scope.completedTime >= 1 && $scope.completedTime < 10) {
                  $scope.showConfirmTime = true;
                } else {
                  $scope.showConfirmTime = false;
                }
              };
              $scope.taskCompletion = function(){
                $scope.$parent.completedTime = $scope.completedTime;
                $scope.$parent.taskcompletion();
              }
            }
          }).then(function(modal) {
            modal.element.modal();
          });
          $scope.uncheck = false;

        };

        $scope.undo = function() {
          $scope.uncheck = false;
        };

    // Show Confrim Button in TASK COMPLETION MODAL BASED ON TIME
    $scope.onChangeTime_completeTask = function() {
      $scope.showConfirmTime = false;
      if ($scope.completedTime >= 1 && $scope.completedTime < 10) {
        $scope.showConfirmTime = true;
      } else {
        $scope.showConfirmTime = false;
      }
    };
    //triggered once the task is completed
    $scope.taskcompletion = function() {
      var data = {
        task_id: $scope.completedtask.id,
        completed_time: $scope.completedTime
      };
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http.post('/projects/completed', data, config).then(function(response) {
        $scope.hookname = response.data.taskname;
        $scope.hooktype = "Completed the task";
        $scope.update_push_queue();
        $scope.slackUpdate();
      });
    };
    //invite users to new brand
    $scope.inviteBrand = function() {
      var data = {
        invitemembers: $scope.invite_brand
      };
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      $http.post('/projects/invite_brand', data, config);
    }
        //update to slack
        $scope.slackUpdate = function() {
          var data = {
            hookname: $scope.hookname,
            hooktype: $scope.hooktype,
            currentProject: $scope.currentProject
          };

          var config = {
            headers: {
              'Content-Type': 'application/json'
            }
          };
          $http.post('/projects/slackUpdate', data, config);
        };

    // Pull tasks from user to TODO-QUEUE
    $scope.pullfromUser = function(t) {

      var data = {
        task_id: t.id,
        currentProject: $scope.currentProject

      };
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http.post('/projects/back_to_add_tasks', data, config).then(function(response) {
         $scope.update_push_queue(); 
      });
     
      $scope.reinit();
    };

  });
//Directive for select2


app.directive('memberDirective', function() {
  return {
    restrict: 'A',
    link: function(scope) {
      $(".memberSelect").select2({
        placeholder: '@email',
        tags: true
      });
    }
  };
});
