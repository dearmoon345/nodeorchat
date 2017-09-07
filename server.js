var http = require('http');//内置http模块提供了HTTP服务器和客户端功能
var fs = require('fs');//内置的path模块提供了与文件系统路径相关的功能
var path = require('path');//内置http模块提供了HTTP服务器和客户端功能
var mime = require('mime');//附加mime模块有根据文件苦熬站名得出mime类型的能力
var cache = {};//用来缓存文件内容的对象

//socket.io所需后加
var chatServer = require('./lib/chat_server');
chatServer.listen(server);

//辅助函数 在文件不存在时发送404错误

function send404(response){

    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('Error 404:resource not found.');
    response.end();
}

//辅助函数提供文件数据服务

function sendFile(response,filePath,fileContents){
    response.writeHead(200,{'Content-Type': mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

//提供静态文件服务

function serveStatic(response,cache,absPath){
    if(cache[absPath]){//检查文件是否缓存在内存中
        sendFile(response,absPath,cache[absPath]);//从内存中返回文件
    }else{
        fs.exists(absPath,function(exists){//检查文件是否存在
            if(exists){
                fs.readFile(absPath,function(err,data){//从硬盘中读取文件
                    if(err){
                        send404(response);
                    }else{
                        cache[absPath] = data;
                        sendFile(response,absPath,data);//从硬盘中读取文件并返回
                    }
                });
            }else{
                send404(response);//404响应
            }
        })
    }
}

//创建HTTP服务器 逻辑如下
var server = http.createServer(function(request,response){//创建HTTP服务器,用匿名函数定义对每个请求的处理行为
    var filePath = false;
    if(request.url == '/'){
        filePath = 'public/index.html';//确定返回的默认HTML文件
    }else{
        filePath = 'public/'+request.url;//将url路径转为文件的相对路径
    }
    var absPath = './'+filePath;
    serveStatic(response,cache,absPath);//返回静态文件
});

//启动http服务器
server.listen(3000,function(){
   console.log("Server listening on port 3000.");
});