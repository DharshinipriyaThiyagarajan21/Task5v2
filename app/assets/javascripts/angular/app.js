
var app = angular.module('app', ['mentio','dndLists','angularModalService']);

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

