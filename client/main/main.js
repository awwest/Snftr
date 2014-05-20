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
    $scope.showNext = false;
    $scope.showLoading = false;
    $scope.postNum = 0;
    $scope.contentType = '/';
    $scope.targetBlog = 'newyorker.tumblr.com';
    $scope.page = 1;

    if ($scope.original) $scope.contentSource = $scope.targetBlog;

    $scope.postPhoto = function(post){
      var photos = [];
      for(var y = 0; y < post.photos.length; y++){
        photos.push('<img src=' + post.photos[y].original_size.url + ' class="img-responsive"></img>');
      }
      photos = photos.join('');
      $scope.things.push({type: 'photo', photos: $sce.trustAsHtml(photos), caption: $sce.trustAsHtml(post.caption), date: post.date});
    };
    $scope.postText = function(post){
      $scope.things.push({body: $sce.trustAsHtml(post.body), title: post.title, date: post.date, type: post.type}); //{html: $sce.trustAsHtml(post.body + post.date)});
    };
    $scope.postQuote = function(post){
      $scope.things.push({type: 'quote', text: post.text, source: $sce.trustAsHtml(post.source), date: post.date});//html: $sce.trustAsHtml('<div>' + post.text + '</div>' + post.source + post.date)});
    };
    $scope.postLink = function(post){
      $scope.things.push({type: 'link', title: post.title, url: $sce.trustAsHtml(post.url), description: post.description, date: post.date}); //html: $sce.trustAsHtml('<a href=' + post.url + '>' + post.title + '</a><div>' + post.description + '</div>')});
    };
    $scope.postChat = function(post){
      $scope.things.push({type: 'chat', title: post.title, body: post.body, date: post.date});//post.title ? $scope.things.push({html: $sce.trustAsHtml('<div>' + post.title + '</div>' + post.body)}) : $scope.things.push({html: $sce.trustAsHtml(post.body)});
    };
    $scope.postAudio = function(post){
      $scope.things.push({type: 'audio', player: $sce.trustAsHtml(post.player), caption: $sce.trustAsHtml(post.caption), date: post.date});//html: $sce.trustAsHtml(post.player + '<div>' + post.caption + '</div>')});
    };
    $scope.postVideo = function(post){

      $scope.things.push({type: 'video', player: $sce.trustAsHtml(post.player[post.player.length-1].embed_code), caption: $sce.trustAsHtml(post.caption), date: post.date});//html: $sce.trustAsHtml(post.player.embed_code)});
    };
    $scope.postAnswer = function(post){
      $scope.things.push({type: 'answer', question: post.question, answer: post.answer, askingName: post.asking_name, askingUrl: post.asking_url});//html: $sce.trustAsHtml('<div>' + post.question + '</div><a href=' + post.asking_url + '>' + post.asking_name + '</a><div>' + post.answer + '</div>')});
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
      $scope.showNext = true;
    };

    $scope.loadNext = function(postNum){
      $scope.lastRequest.offset += postNum;
      $scope.loadRequest();
    };

    $scope.searchFor = function(url){
      $scope.things = [];
      $scope.postNum = 0;
      $scope.lastRequest = {
          blog: url,
          contentType: $scope.contentType,
          source: $scope.contentSource,
          self: $scope.original,
          offset: 0
        };
      $scope.loadRequest();
    };

    $scope.loadRequest = function(){
      var reqUrl;
      $scope.showLoading = true;
      reqUrl = $scope.lastRequest.source ? '/load-from-source' : '/load';
      $http({method: 'POST', url: reqUrl,
        data: $scope.lastRequest})
      .success(function(data, status, headers, config) {
        console.log(data);
        $scope.postNum += data.posts.length;
        for(var i = 0; i < data.posts.length; i++){
          var post = data.posts[i];
          if($scope.contentSource){
            var pSource = post.source_title || post.reblogged_root_name || post.blog_name;
            if(pSource === $scope.contentSource){
              $scope.parsePost(post);
            }
          }else{
            $scope.parsePost(post);
          }
        }
        if($scope.things.length < 19 && data.total_posts > $scope.postNum){
          setTimeout($scope.loadNext($scope.postNum),10000);
        }
        $scope.showLoading = false;
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
