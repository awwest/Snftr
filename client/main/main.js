(function (angular) {
  'use strict';
  angular.module('HRhackathon.main', ['ngRoute', 'HRhackathon.main.note', 'ngSanitize'])
  .config(function ($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'main/main.tpl.html',
        controller: 'MainController'
      })
      .otherwise({
        redirectTo: '/'
      });

  })
  .controller('MainController', function ($scope, $http, $sce) {
    $scope.things = [];
    $scope.contentType = '/';
    $scope.targetBlog = 'newyorker.tumblr.com';
    $scope.postPhoto = function(post){
      var photos = [];
      for(var y = 0; y < post.photos.length; y++){
        photos.push('<img src=' + post.photos[y].original_size.url + '></img>');
      }
      photos = photos.join('');
      $scope.things.push({html: $sce.trustAsHtml(photos)});
    };
    $scope.postText = function(post){
      $scope.things.push({html: $sce.trustAsHtml(post.body)});
    };
    $scope.postQuote = function(post){
      $scope.things.push({html: $sce.trustAsHtml('<div>' + post.text + '</div>' + post.source)});
    };
    $scope.postLink = function(post){
      $scope.things.push({html: $sce.trustAsHtml('<a href=' + post.url + '>' + post.title + '</a><div>' + post.description + '</div>')});
    };
    $scope.postChat = function(post){
      post.title ? $scope.things.push({html: $sce.trustAsHtml('<div>' + post.title + '</div>' + post.body)}) : $scope.things.push({html: $sce.trustAsHtml(post.body)});
    };
    $scope.postAudio = function(post){
      $scope.things.push({html: $sce.trustAsHtml(post.player + '<div>' + post.caption + '</div>')});
    };
    $scope.postVideo = function(post){
      $scope.things.push({html: $sce.trustAsHtml(post.player.embed_code)});
    };
    $scope.postAnswer = function(post){
      $scope.things.push({html: $sce.trustAsHtml('<div>' + post.question + '</div><a href=' + post.asking_url + '>' + post.asking_name + '</a><div>' + post.answer + '</div>')});
    };
    $scope.parsePost = function(post){
      if(post.type === 'photo'){
        $scope.postPhoto(post);
      }else if(post.type === 'text'){
        $scope.postText(post);
      }else if(post.type === 'quote'){
        $scope.postQuote(post);
      }else if(post.type === 'link'){
        $scope.postLink(post);
      }else if(post.type === 'chat'){
        $scope.postChat(post);
      }else if(post.type === 'audio'){
        $scope.postAudio(post);
      }else if(post.type === 'video'){
        $scope.postVideo(post);
      }else if(post.type === 'answer'){
        $scope.postAnswer(post);
      }
    };
    $scope.searchFor = function(url, valid){
      //console.log(valid);
      $http({method: 'POST', url: '/load', data: {blog: url, contentType: $scope.contentType, source: $scope.contentSource}})
      .success(function(data, status, headers, config) {
        // $scope.things.push(data);

      //   console.log(data);
        for(var i = 0; i < data.posts.length; i++){
          var post = data.posts[i];
          if($scope.contentSource){
            console.log(post.source_url, post.source_title);
            if(post.source_title === $scope.contentSource){
              $scope.parsePost(post);
            }
          }else{
            $scope.parsePost(post);
          }
        }
      })
      .error(function(data, status, headers, config) {
        console.log(data);
        console.log(status);
        console.log(headers);
        console.log(config);
      });
    };
  });
}(angular));
