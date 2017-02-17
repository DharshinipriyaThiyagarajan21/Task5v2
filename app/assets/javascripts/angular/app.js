var app = angular.module('app', ['mentio']);

app.directive('directiveTest',function(){
    return {
        restrict : 'A',
        link : function(scope){
            $(".CreateModal").select2({
                placeholder : '@email',
                tags : true
            });
        }
    };
});