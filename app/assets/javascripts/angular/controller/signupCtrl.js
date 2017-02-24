app.controller("signupCtrl", function ($scope) {

    $scope.user = {};
    $scope.userValidity = {};
    $scope.showSignup = false;

    //user validation form - initialisation
    $scope.userValidity.username = false;
    $scope.userValidity.email = false;
    $scope.userValidity.password = false;
    $scope.userValidity.passwordRepeat = false;
    $scope.userValidity.validity = false;


    $scope.validateUsername = function () {
        if ($scope.user.username != null && $scope.user.username.length >= 3 && $scope.user.username.length <= 24) {
            $scope.userValidity.username = true;
        } else {
            $scope.userValidity.username = false;
        }
        $scope.validation();
    }

    $scope.validateEmail = function () {
        if ($scope.signupForm['user[email]'].$valid) {
            $scope.userValidity.email = true;
        } else {
            $scope.userValidity.email = false;
        }
        $scope.validation();
    }

    $scope.validatePassword = function () {

        if ($scope.user.password != null && $scope.user.password.length >= 6 && $scope.user.password.length <= 12) {
            $scope.userValidity.password = true;
        } else {
            $scope.userValidity.password = false;
        }
        $scope.validation();
    }

    $scope.validatePasswordRepeat = function () {
        if ($scope.user.passwordRepeat != null && $scope.user.password === $scope.user.passwordRepeat) {
            $scope.userValidity.passwordRepeat = true;
        } else {
            $scope.userValidity.passwordRepeat = false;
        }
        $scope.validation();
    }

    $scope.validation = function () {

        if ($scope.userValidity.username && $scope.userValidity.email && $scope.userValidity.password && $scope.userValidity.passwordRepeat) {
            console.log("TRUE");
            $scope.showSignup = true;
        } else {
            console.log("FALSE");
            $scope.showSignup = false;
        }
    }

});