app.controller('pageLayoutCtrl',function($scope,$filter,$http, ModalService){

     $scope.todoQueue=[];
     $scope.addTask="";
     $scope.count='';
     $scope.mytask=[];
     $scope.inputMsg='';
     $scope.daySelect = 0;

     $scope.showhide = [1,0,0,0,0,0];

     $scope.tasks=[];
      
     $scope.tasks0=[];
     $scope.tasks1=[];
     $scope.tasks2=[];
     $scope.tasks3=[];
     $scope.tasks4=[];

     $scope.taskClass = ".tasks0";
     $scope.arrayName="";

     $scope.mytasks=1;
     $scope.taskPage=0;
     $scope.showTask=0;
     
     var id = 0;
     var idString       = "";
     var id_num         = 0; 


     // $scope.projectList=[
     //   {project : 'Socialweaver'},
     //   {project : 'Cleartrip Seo'},
     //   {project : 'Cleartrip white'},
     //   {project : 'Rover heath'},
     //   {project : 'Zatalyst'},
     //   {project : 'Freshcorno'},
     //   {project : 'Beatroute'}
     // ];


     $scope.memberList=[
       {members : 'Senthil'},
       {members : 'Sathish'},
       {members : 'Dharshinipriya'},
       {members : 'Sriram'},
       {members : 'Sachin'},
       {members : 'Arjun'},
       {members : 'Bhuvana'},
       {members : 'Suhirtha'},
       {members : 'Tamil'},
       {members : 'Subhash'}
     ];

 
     $scope.addMsg=function() {
     $scope.todoTaskDetails = {};
     $scope.todoTaskDetails.id   = id++;
     $scope.todoTaskDetails.task = $scope.inputMsg;
     $scope.mytask.push({todoTask : $scope.todoTaskDetails});
     $scope.inputMsg="";
     }

     $scope.add=function() {

     $scope.todoTaskDetails = {};
     $scope.todoTaskDetails.id   = id++;
     $scope.todoTaskDetails.task = $scope.addTask;
     $scope.todoQueue.push({todoTask : $scope.todoTaskDetails});
     $scope.count=$scope.todoQueue.length;
     $scope.addTask="";
     }

     // store task details when clicked add
    $scope.addCall = function () {
        var taskTemp = $scope.addTask;
        var startindex = 0;
        var taskSubstring = "";
        var taskSubstringlen = 0;
        var tempString = "";
        var assignedTo = [];

        for (var i = 0; i < taskTemp.length; i++) {
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
        // console.log($scope.assignedUser);
        var data = $.param({
            currentProject: $scope.currentProject,
            task: taskTemp,
            assignedToDetails: $scope.assignedTo_details
        });
        // console.log("inside add call");
        // console.log($scope.assignedTo_details);
        // console.log(assignedTo);
        // console.log($scope.assignedUser);
        $scope.assignedUser = [];
        // console.log($scope.assignedUser);

        $scope.hookname = taskTemp;
        $scope.hooktype = "Created a task";
        $scope.addTask = "";

        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };

        $http.post('/projects/add_task_queue', data, config).then(function (response) {});
        $scope.update_task_queue();
        $scope.slackUpdate();

    };

     $scope.lists=[
     {name : '1'},
     {name : '2'},
     {name : '3'},
     {name : '4'},
     {name : '5'}
     ];

    //my variables
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
                              $scope.clicked=[];
                              $scope.currentProject;
                              $scope.uncheck;
                              $scope.admins;
                              $scope.addAdmins = [];
    var date = new Date();
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";


    // Find the days
    $scope.weekdayFinder = function () {
        tempday = date.getDay();

        for (var i = 0, j = 0; i < 5; i++) {
            if (tempday + i < 7) {
                $scope.days[i] = {
                    day: weekday[tempday + i],
                    tasks: []
                };
            } else {
                $scope.days[i] = {
                    day: weekday[j],
                    tasks: []
                };
                j++;
            }
        }
    };

    $scope.new = function(){
        $scope.myTask(1);
        $scope.initProjModal();

    };




     $scope.daychange = function(d){
        console.log(d);
          $scope.dayselection = d;
         // console.log($scope.dayselection);
          for(var j=0; j<6; j++){
               if(j == $scope.dayselection){
                 $scope.showhide[j] = 1;
                 $scope.taskClass = ".tasks"+j;
                 $scope.arrayName="tasks"+j;
                 $scope.showTask=0;
                 $scope.clicked[0] = "btn-default";
                 $scope.clicked[1] = "btn-default";
                 $scope.clicked[2] = "btn-default";
                 $scope.clicked[3] = "btn-default";
                 $scope.clicked[4] = "btn-default";
                 $scope.clicked[5] = "btn-default";

                 
                 $scope.clicked[j]="btn-info";
                 
                 // console.log($scope.tasks0);

               }
               else{
                 $scope.showhide[j] = 0;
                 $scope.showTask=0;
               }
          }
     };

     $scope.changeTask = function(k){
            // console.log($scope.tasks0);

          $scope.taskPage=k;
          if($scope.taskPage == $scope.mytasks)
          {    $scope.myTask(2);
               $scope.showTask=1;
               $scope.showhide=[0,0,0,0,0,0];
               
               // console.log($scope.tasks);
          }
          else
          {
               $scope,showTask=0;
          }
     }


     $scope.removetodo  = function(event){
          idString = event.target.id;
          id_num = parseInt(idString.substring(7));

          for(var i=0; i<$scope.todoQueue.length; i++){
               if($scope.todoQueue[i].todoTask.id == id_num){
               $scope.todoQueue.splice(i,1);
               break;
               }
          }

          $scope.reinit();
     };
     




     $scope.reinit = function(){
          var idString       = "";
          var id_num         = 0; 
     };


//  HTTP FUNCTION BEGINS

// get project list and current user

    $scope.initProjModal = function () {
        
        $http({
            method: "GET",
            url: "/projects/get"
        }).then(function (response) {
            $scope.createproject_responsedata = response.data;
            $scope.admins =  JSON.parse(response.data.admins);
            // console.log($scope.admins);
        if($scope.admins != null)
        {
            for(var i=0 ; i<$scope.createproject_responsedata.projects.length ; i++)
            {
                for(var j=0; j<$scope.admins.length ; j++)
                {
                   
                    if($scope.createproject_responsedata.projects[i].id == $scope.admins[j].project_id)
                    {
                        $scope.createproject_responsedata.projects[i].admin = 1;
                       
                    }
                }
            }
         }
            $scope.user = response.data.user;
        });
               

    };
    $scope.confirmProject = function () {
        var data = $.param({
            projectname: $scope.projectname,
            memberlist: $scope.createproject_memberlist,
            hook: $scope.hook
        });

        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };

        $http.post('/projects', data, config);
        $scope.projectname = '';
        $scope.createproject_memberlist = '';
        $scope.hook = '';

        $scope.initProjModal();
    };

    // display data about selected project 
    $scope.selectProject = function (x) {
        $scope.adminClear = '';
        var data = $.param({
            currentProject: x
        });
        $scope.currentProject = x;
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
       

        $http.post('/projects/members', data, config).then(function (response) {
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
            // console.log($scope.newAdmin);
            // console.log("new admins over");

            for (var i = 0; i < $scope.projectMembers.members.length; i++) {
                $scope.items.push({
                    username: $scope.projectMembers.members[i].username,
                    imageUrl: $scope.projectMembers.members[i].avatar.thumb.url,
                    label: $scope.projectMembers.members[i].username + " (" + $scope.projectMembers.members[i].email + ")",
                    email: $scope.projectMembers.members[i].email
                });
                
            }
            console.log($scope.items);

            $scope.completedTasks = response.data.completed_queue;
            $scope.update_push_queue();
        });
        $scope.daychange(0);
        $scope.update_task_queue();
        $scope.update_time();
    };

    //update task queue
    $scope.update_task_queue = function () {
        var data = $.param({
            currentProject: $scope.currentProject,
        });


        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };

        $http.post('/projects/update_task_queue', data, config).then(function (response) {
            $scope.addedTasks.user_task_queue = response.data.user_task_queue;
            $scope.addedTasks.task_queue = response.data.task_queue;
            $scope.totalActiveTasksInQueue = response.data.total_task.length;
        });
    };

    $scope.callEditProject = function () {
      var data = $.param({
        currentProject : $scope.currentProject
      });
      var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };

      $http.post('/projects/call_edit', data, config).then(function (response) {

            $scope.projectname = response.data.name;
            $scope.hook = response.data.hook;
        });
    };

    //update Members
    $scope.updateMembers = function () {
        var data = $.param({
            project: $scope.currentProject,
            addMembers: $scope.memberlist_add,
            removeMembers: $scope.memberlist_remove
        });


        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };

        $http.post('/projects/update_members', data, config).then(function (response) {

            $scope.projectMembers = response.data;
        });
        $scope.memberlist_add = '';
        $scope.memberlist_remove = '';
    };

    $scope.editProject = function () {
        console.log($scope.addAdmins);
        console.log($scope.currentProject);
      var data = $.param({
        currentProject : $scope.currentProject,
        projectname : $scope.projectname,
        hook : $scope.hook,
        admins : $scope.addAdmins
      });

      var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('/projects/edit_project', data, config).then(function (response) {
          $scope.initProjModal(); 
          $scope.currentProject = response.data.project;
        });
           $scope.adminClear = ''; 
           $scope.newAdmin = [];
           $scope.addAdmins = [];
        $scope.selectProject($scope.currentProject);       

    };

    //update added queue
    $scope.update_push_queue = function () {
        var data = $.param({
            currentProject: $scope.currentProject
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('/projects/display_task', data, config).then(function (response) {
            $scope.days.one = response.data.zero;
            $scope.days.two = response.data.one;
            $scope.days.three = response.data.two;
            $scope.days.four = response.data.three;
            $scope.days.five = response.data.four;
            $scope.completed = response.data.completed_queue;
            $scope.totalCompletedTasks = $scope.completedTasks.length;
        });
        value = false
        $scope.update_task_queue();
        $scope.update_time();
        $scope.myTask();

    };

    $scope.update_time = function () {
        var data = $.param({
            currentProject: $scope.currentProject,
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('/projects/update_time', data, config).then(function (response) {
            $scope.totalEstimatedTime = response.data.estimated_time;
            $scope.totalCompletionTime = response.data.completed_time;
        });
    };
    

     //delete projects
     $scope.deleteIdFinder = function (event, tempdayID) {
        tempday = tempdayID;
        idString = event.target.id;
        id_num = parseInt(idString.substring(7));

        var data = $.param({
            project_id: id_num,

        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('/projects/delete_project', data, config).then(function (response) {

        });
        if ($scope.currentProject.id == id_num) {
            $scope.projectMembers = '';
            $scope.addedTasks.task_queue = '';
            $scope.completedTasks = '';
            $scope.createproject_responsedata = '';
            $scope.currentProject = '';
        }
        $scope.initProjModal();

    };


     //Select only username in mentions
    $scope.getPeopleText = function (item) {
        // note item.label is sent when the typedText wasn't found
        $scope.assignedUser.push(item.email);
        return '@' + item.username + '';
    };
    $scope.makeAdmin = function (item) {
        console.log(item);
        // note item.label is sent when the typedText wasn't found
        $scope.addAdmins.push(item.email);
        console.log($scope.addAdmins);
        return '@' + item.username + '';
    };

     // Delete Tasks from TODO-QUEUE
    $scope.deleteTask = function (event) {
        idString = event.target.id;
        id_num = parseInt(idString.substring(7));

        for (var i = 0; i < $scope.todoQueue.length; i++) {
            if ($scope.todoQueue[i].todoTask.id == id_num) {
                $scope.todoQueue.splice(i, 1);
                break;
            }
        }
        var data = $.param({
            task_id: id_num,
            currentProject: $scope.currentProject

        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('/projects/delete_task', data, config).then(function (response) {

        });
        $scope.update_task_queue();


        $scope.reinit();
    };


    $scope.call = function(x){
      $scope.draggedTask = x;
      $scope.show(x);
    };
    // Show Confrim Button in ADD TASK TO USER MODAL BASED ON TIME
    $scope.onChangeTime_addTask = function () {
            $scope.showConfirmTime = false;
            if ($scope.estimatedTime >= 1 && $scope.estimatedTime <= 5) {
                $scope.showConfirmTime = true;
            } else {
                $scope.showConfirmTime = false;
            }
        };

      $scope.show = function(x) {
        $scope.draggedTask = x;
       ModalService.showModal({
           templateUrl: 'pushModal.html.erb',
           controller: "pageLayoutCtrl",
           scope: $scope
       }).then(function(modal) {
           modal.element.modal();    
       });
   };

   $scope.pushintoUser = function () {
                var data = $.param({
                    task_id: $scope.draggedTask.id,
                    estimated_time: $scope.estimatedTime,
                    day_num: $scope.dayselection,
                    currentProject: $scope.currentProject,
                });
        $scope.hooktype = "Added a task";
        $scope.hookname = $scope.draggedTask.name;
        $scope.slackUpdate();
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('/projects/take_task', data, config).then(function (response) {
        });
        $scope.update_push_queue();
        $scope.update_time();
        $scope.reinit();
    };
    $scope.myTask = function (value) {
        $http({
            method: "GET",
            url: "/projects/mytask"
        }).then(function (response) {
             $scope.tasks = response.data.mytask
             $scope.length = $scope.tasks.length;
             if(value == 1){
             $scope.currentProject = {name: "My tasks"};
             
             $scope.daychange(0);
              $scope.changeTask(1);

              }
              else if(value == 2){
                $scope.currentProject = {name: "My tasks"};
                $scope.projectMembers = '';
                   $scope.totalCompletedTasks = 0;
              }
              $scope.update_task_queue();

              

        });
    };

    $scope.checked =function(t) {
        $scope.completedtask = t;
        // console.log(t);
       ModalService.showModal({
           templateUrl: 'completeTaskpushModal.html.erb',
           controller: "pageLayoutCtrl",
           scope: $scope
       }).then(function(modal) {
           modal.element.modal();    
       });
       $scope.uncheck = false;

    };

    $scope.undo = function() {
       
        $scope.uncheck = false;
       
    };
     // Show Confrim Button in TASK COMPLETION MODAL BASED ON TIME
    $scope.onChangeTime_completeTask = function () {
        $scope.showConfirmTime = false;
        if ($scope.completedTime >= 1 && $scope.completedTime < 10) {
            $scope.showConfirmTime = true;
        } else {
            $scope.showConfirmTime = false;
        }
    };

    $scope.taskcompletion = function () {

        var data = $.param({
            task_id: $scope.completedtask.id,
            completed_time: $scope.completedTime
        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('/projects/completed', data, config).then(function (response) {
          $scope.hookname = response.data.taskname;
          $scope.hooktype = "Completed task";

          $scope.slackUpdate();

        });
        $scope.update_push_queue();

    };

    $scope.inviteBrand = function(){
        var data = $.param({
        invitemembers : $scope.invite_brand
      });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('/projects/invite_brand', data, config);
    }

    $scope.slackUpdate = function () {
      var data = $.param({
        hookname : $scope.hookname,
        hooktype : $scope.hooktype,
        currentProject : $scope.currentProject
      });
      var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
      $http.post('/projects/slackUpdate', data, config);
    };


    // Pull tasks from user to TODO-QUEUE
    $scope.pullfromUser = function (t) {
        
        var data = $.param({
            task_id: t.id,
            currentProject: $scope.currentProject

        });
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        $http.post('/projects/back_to_add_tasks', data, config).then(function (response) {
        });
        $scope.update_task_queue();
        $scope.update_push_queue();
        $scope.update_time();

        $scope.reinit();
    };

});

 



//Directive for select2


app.directive('memberDirective',function(){
    return {
        restrict : 'A',
        link : function(scope){
            $(".memberSelect").select2({
                placeholder : '@email',
                tags : true
            });
        }
    };
});

