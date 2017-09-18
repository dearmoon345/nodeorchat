//用来处理聊天命令,发送消息,请求变更房间或名称
//相当于定义一个类,初始换传入一个参数socket
var Chat = function(socket){
    this.socket = socket;
};
//添加发送聊天消息的函数
Chat.prototype.sendMessage = function(room,text){
    var message = {
        room:room,
        text:text
    };
    this.socket.emit('message',message);
};
//变更房间的函数
Chat.prototype.changeRoom = function(room){
    this.socket.emit('join',{
        newRoom:room
    });
};

//处理聊天命令  join:加入或创建一个房间 nick:用来修改昵称
Chat.prototype.processCommand = function(command){
    var words = command.split(' ');
    var command = words[0].substring(1,words[0].length).toLowerCase();
    var message = false;
    switch(command){
        case 'join':
            words.shift();
    }
}