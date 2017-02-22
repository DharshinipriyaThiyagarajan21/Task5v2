app.controller('pageLayoutCtrl',function($scope, $filter, $http){

  $scope.items = [];

	$scope.todoQueue   = [];
  $scope.userTodo    = [];
  $scope.completedTasks= [];
  $scope.days        = {};
    $scope.days.one = [];
    $scope.days.two = [];
    $scope.days.three = [];
    $scope.days.four = [];
    $scope.days.five = [];
    $scope.showDelete;
  $scope.dayselection= "0";
  $scope.showConfirmTime = false;

  $scope.estimatedTime = 0;
  $scope.completedTime = 0;

  $scope.totalEstimatedTime  = 0;
  $scope.totalCompletionTime = 0;

  $scope.totalActiveTasksInQueue;
  $scope.totalCompletedTasks;

  $scope.addedTasks = {};
  $scope.addedTasks.task_queue = [];

  $scope.flag = false;

  var date 	  	 = new Date();
  var weekday		 = [];
  var idString       = "";
  var id_num         = 0;
  var id             = 0;
  var tempday        = 0;

	weekday[0]	 = "Sunday";
	weekday[1]	 = "Monday";
	weekday[2]	 = "Tuesday";
	weekday[3]	 = "Wednesday";
	weekday[4]	 = "Thursday";
	weekday[5]	 = "Friday";
	weekday[6]	 = "Saturday";


  // Find the days
  $scope.weekdayFinder  = function(){
    tempday = date.getDay();

    for(var i=0, j=0; i<5; i++){
      if(tempday+i < 7){
        $scope.days[i] = {day: weekday[tempday+i], tasks: []};
      }
      else {
        $scope.days[i] = {day: weekday[j], tasks: []};
        j++;
      }
    }
  };

  // Show Confrim Button in ADD TASK TO USER MODAL BASED ON TIME
  $scope.onChangeTime_addTask = function(){
    $scope.showConfirmTime = false;
    if($scope.estimatedTime>=1 && $scope.estimatedTime<=5){
      $scope.showConfirmTime = true;
    }
    else {
      $scope.showConfirmTime = false;
    }
  }
  // Show Confrim Button in TASK COMPLETION MODAL BASED ON TIME
  $scope.onChangeTime_completeTask = function(){
    $scope.showConfirmTime = false;
    if($scope.completedTime>=1 && $scope.completedTime<10){
      $scope.showConfirmTime = true;
    }
    else {
      $scope.showConfirmTime = false;
    }
   

  };


  // Add tasks to USER
  $scope.dayselectionevent  = function(event){
      idString = event.target.id;
      id_num = parseInt(idString.substring(7));
  };

  $scope.pushintoUser = function(){
    $scope.todoTaskDetails = {};

    tempday = parseInt($scope.dayselection);

    for(var i=0; i<$scope.addedTasks.task_queue.length; i++){
      if($scope.addedTasks.task_queue[i].id == id_num){

        var data = $.param({
          task_id: $scope.addedTasks.task_queue[i].id,
          estimated_time: $scope.estimatedTime,
          day_num: tempday
        });
        break;
      }
    }

    var config={
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
    $http.post('/projects/take_task', data, config).then(function (response){
      
      
    });
    $scope.update_push_queue();
        $scope.update_time();



    
    $scope.reinit();
  };
   //update added queue
   $scope.update_push_queue = function(){
    var data = $.param({
          currentProject: $scope.currentProject
        });
    var config={
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
     $http.post('/projects/display_task', data, config).then(function (response){
      $scope.days.one = response.data.zero;
      $scope.days.two = response.data.one;
      $scope.days.three = response.data.two;
      $scope.days.four = response.data.three;
      $scope.days.five = response.data.four;   
      $scope.completedTasks = response.data.completed_queue;
      $scope.totalCompletedTasks = $scope.completedTasks.length;

    });
     $scope.update_task_queue();
         $scope.update_time();

   };


  // Pull tasks from user to TODO-QUEUE
  $scope.pullfromUser = function(event, tempday){
    idString = event.target.id;
    id_num = parseInt(idString.substring(7));

    // $scope.todoTaskDetails = {};

    // for(var i=0; i<$scope.days[tempday].tasks.length; i++){
    //   if($scope.days[tempday].tasks[i].userTask.id == id_num){

    //     $scope.todoTaskDetails.id   = $scope.days[tempday].tasks[i].userTask.id;
    //     $scope.todoTaskDetails.task = $scope.days[tempday].tasks[i].userTask.task;
    //     $scope.todoTaskDetails.date = $scope.days[tempday].tasks[i].userTask.date
    //     $scope.todoTaskDetails.time = $scope.days[tempday].tasks[i].userTask.time;
    //     $scope.todoTaskDetails.createdBy  = $scope.days[tempday].tasks[i].userTask.createdBy;
    //     $scope.todoTaskDetails.assignedTo = $scope.days[tempday].tasks[i].userTask.assignedTo;
    //     $scope.todoTaskDetails.estimatedTime = 0;
    //     $scope.todoTaskDetails.completedTime = 0;

    //     $scope.days[tempday].tasks.splice(i,1);
    //     break;
    //   }
    // }

    // $scope.todoQueue.push({todoTask : $scope.todoTaskDetails});
    var data = $.param({
          task_id: id_num,
          currentProject: $scope.currentProject

        });
   var config={
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
    $http.post('/projects/back_to_add_tasks', data, config).then(function (response){
      
    });
    $scope.update_task_queue();
    $scope.update_push_queue();
    $scope.update_time();

    $scope.reinit();
  };

  // Delete Tasks from TODO-QUEUE
  $scope.deleteTask  = function(event){
    idString = event.target.id;
    id_num = parseInt(idString.substring(7));

    for(var i=0; i<$scope.todoQueue.length; i++){
      if($scope.todoQueue[i].todoTask.id == id_num){
        $scope.todoQueue.splice(i,1);
        break;
      }
    }
    var data = $.param({
          task_id: id_num,
          currentProject: $scope.currentProject

        });
   var config={
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
    $http.post('/projects/delete_task', data, config).then(function (response){
      
    });
    $scope.update_task_queue();


    $scope.reinit();
  };

  //update estimated and completed time
  $scope.update_time = function(){
    console.log("inside update time");
    var data = $.param({
      currentProject: $scope.currentProject,
    });

    var config={
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
      };

      $http.post('/projects/update_time', data, config).then(function (response){
        $scope.totalEstimatedTime = response.data.estimated_time;
      $scope.totalCompletionTime = response.data.completed_time;
      });
  };

  // Task Completion in USERTASKS
  $scope.idFinder  = function(event, tempdayID){
      tempday  = tempdayID;
      idString = event.target.id;
      id_num   = parseInt(idString.substring(7));
  };
    

    $scope.deleteIdFinder  = function(event, tempdayID){
      tempday  = tempdayID;
      idString = event.target.id;
      id_num   = parseInt(idString.substring(7));
      
      var data = $.param({
          project_id: id_num,
          
        });
     var config={
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
      };
      $http.post('/projects/delete_project', data, config).then(function (response){
        
      });
      if($scope.currentProject.id == id_num)
      {
        $scope.projectMembers = '';
        $scope.addedTasks.task_queue = '';
        $scope.completedTasks = '';
        $scope.createproject_responsedata = '';
        $scope.currentProject = '';
      }
      $scope.initProjModal();
      
  };

  $scope.taskcompletion = function(){

    // $scope.todoTaskDetails = {};

    // for(var i=0; i<$scope.days[tempday].tasks.length; i++){
    //   if($scope.days[tempday].tasks[i].userTask.id == id_num){

    //     $scope.todoTaskDetails.id   = $scope.days[tempday].tasks[i].userTask.id;
    //     $scope.todoTaskDetails.task = $scope.days[tempday].tasks[i].userTask.task;
    //     $scope.todoTaskDetails.date = $scope.days[tempday].tasks[i].userTask.date
    //     $scope.todoTaskDetails.time = $scope.days[tempday].tasks[i].userTask.time;
    //     $scope.todoTaskDetails.createdBy  = $scope.days[tempday].tasks[i].userTask.createdBy;
    //     $scope.todoTaskDetails.assignedTo  = $scope.days[tempday].tasks[i].userTask.assignedTo;
    //     $scope.todoTaskDetails.estimatedTime = $scope.days[tempday].tasks[i].userTask.estimatedTime;
    //     $scope.todoTaskDetails.completedTime = $scope.completedTime;

    //     $scope.days[tempday].tasks.splice(i,1);

    //     $scope.totalEstimatedTime += $scope.todoTaskDetails.estimatedTime;
    //     $scope.totalCompletionTime += $scope.todoTaskDetails.completedTime;
    //     break;
    //   }
    // }

    // $scope.completedTasks.push({todoTask : $scope.todoTaskDetails});
    var data = $.param({
          task_id: id_num,
          completed_time: $scope.completedTime
        });
   var config={
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
    $http.post('/projects/completed', data, config).then(function (response){
      
    });
      $scope.update_push_queue();


    // $scope.totalCompletedTasks++;

    // $scope.reinit();
  };

  $scope.reinit = function(){
    $scope.dayselection= "0";
    $scope.estimatedTime = 0;
    $scope.completedTime = 0;

    var idString       = "";
    var id_num         = 0;
    var tempday        = 0;
  };

  // HTTP FUNCTIONS
  // ......................................
 

  $scope.initProjModal = function(){
    
    $http({
      method: "GET",
      url: "/projects/get"
    }).then(function (response){
      $scope.createproject_responsedata = response.data;
      $scope.user = response.data.user;
    //   if($scope.flag == false)
    //   {
    //   $scope.selectProject($scope.createproject_responsedata.projects[0]);
    // }

    });
    
  };

  // display data about selected project 
  $scope.selectProject = function(x){
    var data = $.param({
      currentProject: x
    });
    $scope.currentProject = x;
    var config={
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };


    $http.post('/projects/members', data, config).then(function (response){
      $scope.items.length = 0;
      $scope.projectMembers = response.data;
      for(var i=0; i<$scope.projectMembers.members.length; i++){
        $scope.items.push({label: $scope.projectMembers.members[i].email});
      }
      $scope.completedTasks = response.data.completed_queue;
      $scope.update_push_queue();
    });

    $scope.update_task_queue();
    $scope.update_time();

  };
  // store task details when clicked add
     $scope.addCall = function(){
      var taskTemp = $scope.addTask;
      var startindex = 0;
      var taskSubstring = "";
      var taskSubstringlen = 0;
      var tempString = "";
      var assignedTo = [];

      for(var i=0; i<taskTemp.length; i++)
      {
        var flag = false;
        if(taskTemp.charAt(i) == '@')
        {
          startindex = i;
          for(var j=startindex; j<taskTemp.length; j++)
          {
            if(taskTemp.charAt(j) == ' ')
            {
              taskSubstringlen = j;
              flag = true;
              i = j;
              break;
            }
          }
          if(!flag){
            taskSubstringlen = taskTemp.length;
          }
          taskSubstring = taskTemp.substring(startindex+1, taskSubstringlen);
          assignedTo.push(taskSubstring);
        }
      }

      for(var i=0; i<assignedTo.length; i++){
        taskTemp = taskTemp.replace("@"+assignedTo[i], "");
      }

      $scope.assignedTo_details = [];
      for(var i=0; i<assignedTo.length; i++){
        for(var j=0; j<$scope.projectMembers.members.length; j++){
          if(assignedTo[i] == $scope.projectMembers.members[j].email){
            $scope.assignedTo_details.push($scope.projectMembers.members[j]);
          }
        }
      }
      var data = $.param({
        currentProject: $scope.currentProject,
        task: taskTemp,
        assignedToDetails: $scope.assignedTo_details
      });
      
      $scope.addTask = "";

    var config={
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };

    $http.post('/projects/add_task_queue', data, config).then(function (response){
    });
    $scope.update_task_queue();
    
  };
  //my task
      $scope.myTask = function(){
        $http({
        method: "GET",
        url: "/projects/mytask"
        }).then(function (response){
        $scope.tasks = response.data;
        
        });
      };
   //update task queue
   $scope.update_task_queue = function(){
        var data = $.param({
            currentProject: $scope.currentProject,
            });
            

            var config={
              headers:{
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
              }
            };

            $http.post('/projects/update_task_queue', data, config).then(function (response){
              
              $scope.addedTasks.task_queue = response.data.task_queue;
              $scope.totalActiveTasksInQueue = $scope.addedTasks.task_queue.length;
            });
   };


    //update Members
        $scope.updateMembers = function(){
          var data = $.param({
            project: $scope.currentProject,
            addMembers: $scope.memberlist_add,
            removeMembers: $scope.memberlist_remove
            });
            

            var config={
              headers:{
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
              }
            };

            $http.post('/projects/update_members', data, config).then(function (response){
              
              $scope.projectMembers = response.data;
            });
        };



  $scope.confirmProject	=	function(){
  	var data = $.param({
  		projectname: $scope.projectname,
  		memberlist: $scope.createproject_memberlist
  	});

  	var config={
  		headers:{
  			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
  		}
  	};

  	$http.post('/projects', data, config);
    $scope.projectname = '';
    $scope.createproject_memberlist = '';

  	$scope.initProjModal();
  };

});

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
