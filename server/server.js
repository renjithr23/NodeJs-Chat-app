const path = require('path')
const http = require('http')
const publicPath = path.join(__dirname,"../public")
var express = require('express')
const socketIO = require('socket.io')


const {generateMessage} = require('./utils/message')
const {generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users');

var port = process.env.PORT || 3000;

console.log(__dirname + '/../public');
console.log(publicPath);

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));


io.on('connection',(socket)=>{
  console.log('New user connected');

  //
  // socket.on('createEmail',(newEmail)=>{
  //   console.log('create email',newEmail);
  // })
  socket.on('join',(params,callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)) {
        callback("Name and room name is required")
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);

    io.emit(params.room).emit('updateUserList',users.getUserList(params.room));
    socket.emit("newMessage",generateMessage('Admin','Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined this room`));

    callback();
  })

  socket.on('createMessage',(message,callback)=>{
    io.emit("newMessage",generateMessage(message.from,message.text));
    callback('');

  })

  //   socket.broadcast.emit('newMessage',{
  //     from:message.from,
  //     text:message.text,
  //     createdAt:new Date().getTime()
  //   })
  // })

  socket.on('createLocationMessage',(coords)=>{
    io.emit('newLocationMessage',generateLocationMessage('Admin:',coords.latitude,coords.longitude))
  })


  socket.on('disconnect',()=>{
    console.log("Disconnected from client");
    var user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin', `${user.name} has left`));
    }
  })

})

// app.get('/',(req,res)=>{
//   res.sendFile(path.join(publicPath,"/index.html"));
// })

server.listen(port,()=>{
  console.log(`Started on port ${port}`);
})
