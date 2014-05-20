"use strict";

var express = require('express');
var app = express();
var routers = {};
var NoteRouter = express.Router();
routers.NoteRouter = NoteRouter;

require('./config.js')(app, express, routers);

require('../note/note_routes.js')(NoteRouter);

// var tumblr = require('tumblr.js');
// app.client = tumblr.createClient({
//   consumer_key: 'daW4dgiFgb4oVOw8IB0vUjCyipIoRyYMlUVkBJUrp3AX8ENaVo',
//   consumer_secret: 'FZ4dluZeGXTlMT109sG5lG3iqgYUN1PF7PXjOhXMSbwm8dVBLi',
//   // token: '<oauth token>',
//   // token_secret: '<oauth token secret>'
// });

module.exports = exports = app;


// OAuth Consumer Key:  daW4dgiFgb4oVOw8IB0vUjCyipIoRyYMlUVkBJUrp3AX8ENaVo
// Secret Key:  FZ4dluZeGXTlMT109sG5lG3iqgYUN1PF7PXjOhXMSbwm8dVBLi
