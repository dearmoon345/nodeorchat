//下面这些声明让我们可以使用socket.io

var socketio = require('socket.io');
var io;
var guestNumber =1;
var nickName = {};
var nameUsed = [];
var currentRoom = {};

//启动socketio服务器
exports.listen = function(server){
    io = socketio.listen(server);//启动socketio服务器,允许他搭载在已有的HTTP服务器上
    io.set('log level',1);

    io.sockets.on('connection',function(socket){//定义每个用户连接的处理逻辑
        guestNumber = assignGuestName(socket,guestNumber,nickNames,namesUsed);//在用户连接上来时赋予其一个访客名
        joinRoom(socket,'Lobby');//在用户连接上来时把它放入聊天室Lobby里
        handleMessageBroadcasting(socket,nickNames);//处理用户的消息,更名,以及聊天室的创建和变更
        handleNameChangeAttempts(socket,nickNames,namesUsed);
        handleRoomJoining(socket);
        socket.on('rooms',function(){//用户发出请求时,向其提供已经被占用的聊天室列表
            socket.emit('rooms',io.sockets.manager.rooms);
        });
        handleClientDisconnection(socket,nickNames,namesUsed);//定义用户断开连接后的清除逻辑
    });
};

//辅助函数第一个
//分配用户昵称
function assignGuestName(socket,guestNumber,nickNames,namesUsed){
    var name = 'guest'+guestNumber; //生成新昵称
    nickNames[socket.id] = name;//把用户昵称跟客户端链接ID关联上
    socket.emit('nameResult',{//让用户知道他们的昵称
        success:true,
        name:name
    });
    namesUsed.push(name);//存放已经被占用的昵称
    return guestNumber+1; 计数
}
//辅助函数第二个
//进入聊天室
function joinRoom(socket,room){
    socket.join(room);//让用户进入房间
    currentRoom[socket.id] = room;//记录用户当前的房间
    socket.emit('joinResult',{room:room});//让用户知道了他们进入了新的房间
    socket.broadcast.to(room).emit('message',{//让房间里的其他用户知道有新用户进入了房间
        text:nickNames[socket.id]+'has joined'+room+'.'
    });
    var usersInRoom = io.sockets.clients(room);//确定有哪些用户在这个房间里
    if(usersInRoom.length>1){//如果不止一个用户在这个房间里,汇总下都是谁
        var usersInRoomSummary = 'Users currently in'+room +':';
        for(var index in usersInRoom){
            var userSocketId = usersInRoom[index].id;
            if(userSocketId !=socket.id){
                if(index>0){
                    usersInRoomSummary +=',';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
        socket.emit('message',{text:usersInRoomSummary});//将房间里面其他用户的汇总发送给这个用户
    }
}

//辅助函数第三个
//3 处理昵称变更请求
function handleNameChangeAttempts(socket,nickNames,namesUsed) {
    socket.on('nameAttempt',function(name) {
        if(name.indexOf('Guest') == 0){
            socket.emit('nameRequest',{
                success:false,
                message:'昵称不能以Guest开头'
            });
        }else{
            if(namesUsed.indexOf(name) == -1){
                var previousName = nickNames[socket.id]
            }
        }
    })
}
