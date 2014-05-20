"use strict";

var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: 'daW4dgiFgb4oVOw8IB0vUjCyipIoRyYMlUVkBJUrp3AX8ENaVo',
  consumer_secret: 'FZ4dluZeGXTlMT109sG5lG3iqgYUN1PF7PXjOhXMSbwm8dVBLi'
  // token: '<oauth token>',
  // token_secret: '<oauth token secret>'
});
/*
 * MiddleWare for the entire app
*/

module.exports = exports = {
  logError: function (err, req, res, next) {
    if (err) {
      console.error(err);
      return next(err);
    }
    next();
  },

  handleError: function (err, req, res, next) {
    if (err) {
      res.send(err, 500);
    }
  },
  cors: function (req, res, next) {
    res.header('Access-Controll-Allow-Origin', '*');
    res.header('Access-Controll-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Controll-Allow-Header', 'Cotent-tyope, Authorization');

    if (req.method === 'Options') {
      res.send(200);
    } else {
      return next();
    }
  },
  loadPosts: function (req, res, next){

    client.posts(req.body.blog, {type: req.body.contentType, limit: 20, offset: req.body.offset, reblog_info: 'true'}, function(err, data){
      if(err){
        res.send(err, 404);
      }
      res.send(data);
    });
    // client.tagged('Breaking Bad', {'limit':5}, function(err, data){
    //   //console.log('Data received', data);
    //   res.send(data);
    // });
  },
  loadFromSource: function(req, res, next){
    // var foundPosts = 0;
    // var postList = [];
    // var totalPosts = 0;
    client.posts(req.body.blog, {type: req.body.contentType, limit: 20, offset: req.body.offset, reblog_info: 'true'}, function(err, data){
      if(err){
        res.send(err, 404);
      }
      res.send(data);
      // foundPosts += 20;
      // console.log('Making request');
      // totalPosts = req.body.offset;
      // for(var i=0; i<data.posts.length; i++){
      //   if(data.posts[i].source_title === req.body.source){
      //     postList.push(data.posts[i]);
      //     foundPosts++;
      //     console.log(foundPosts);
      //   }
      // }
      // console.log(req.body.offset);
    });

  }
};
