angular.module('HRhackathon.main.note', ['ngRoute'])

.config(function ($routeProvider) {
  $routeProvider
    .when('/notes', {
      templateUrl: 'note/note.tpl.html',
      controller: 'NoteController'
    });
})
.controller('NoteController', function ($scope) {
  $scope.notes = [];
});