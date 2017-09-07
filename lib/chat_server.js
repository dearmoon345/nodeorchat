//下面这些声明让我们可以使用socket.io

var socketio = require('socket.io');
var io;
var guestNumber =1;
var nickName = {};
var nameUsed = [];
var currentRoom = {};