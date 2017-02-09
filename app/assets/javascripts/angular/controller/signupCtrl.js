var signup = angular.module("index", []);

signup.controller("signupCtrl", function($scope){

  $scope.user = {};
  $scope.userValidity = {};

  //user validation form - initialisation
  $scope.userValidity.username        = false;
  $scope.userValidity.password        = false;
  $scope.userValidity.passwordRepeat  = false;

  $scope.submitForm = function(){
    console.log($scope.user.username.length);
  };

  $scope.validateUsername = function(){
    if($scope.user.username != null && $scope.user.username.length >= 6 && $scope.user.username.length <= 24){
      $scope.userValidity.username = true;
    }
    else{
      $scope.userValidity.username = false;
    }
  }

  $scope.validatePassword = function(){
    if($scope.user.password != null && $scope.user.password.length >= 6 && $scope.user.password.length <= 12){
      $scope.userValidity.password = true;
    }
    else{
      $scope.userValidity.password = false;
    }
  }

  $scope.validatePasswordRepeat = function(){
    if($scope.user.passwordRepeat != null && $scope.user.password === $scope.user.passwordRepeat){
      $scope.userValidity.passwordRepeat = true;
    }
    else{
      $scope.userValidity.passwordRepeat = false;
    }
  }


  // //user validation form - condition check
  // if($scope.user.username.length >= 6 && $scope.user.username.length <= 24){
  //   console.log("true");
  // }
  // else{
  //   console.log("false");
  // }
  //
  // if($scope.user.password.length >= 8 && $scope.user.password.length <= 12){
  //   $scope.userValidity.password = true;
  // }
  // else{
  //   $scope.userValidity.password = false;
  // }


});