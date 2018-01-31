const path = require('path')
const http = require('http')
const publicPath = path.join(__dirname,"../public")
var express = require('express')
const socketIO = require('socket.io')

var port = process.env.PORT || 3000;

console.log(__dirname + '/../public');
console.log(publicPath);

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));


io.on('connection',(socket)=>{
  console.log('New user connected');

  socket.emit("newMessage",{
    from:"admin",
    text:"Welcome to the chat app",
    createdAt:new Date().getTime()
  });

  // socket.emit("newEmail", {
  //   from:"mike@example.com",
  //   text:"Hey, this is created on ."
  // });

  socket.broadcast.emit('newMessage',{
    from:"admin",
    text:"new user joined",
    createdAt:new Date().getTime()
  })
  //
  // socket.on('createEmail',(newEmail)=>{
  //   console.log('create email',newEmail);
  // })


  socket.on('createMessage',(message)=>{
    console.log('New message received',message);
    io.emit("newMessage",{
      from:newMessage.from,
      text:newMessage.text,
      createdAt:new Date().getTime()
    });
  })

  //   socket.broadcast.emit('newMessage',{
  //     from:message.from,
  //     text:message.text,
  //     createdAt:new Date().getTime()
  //   })
  // })


  socket.on('disconnect',()=>{
    console.log("Disconnected from client");
  })

})

// app.get('/',(req,res)=>{
//   res.sendFile(path.join(publicPath,"/index.html"));
// })

server.listen(port,()=>{
  console.log(`Started on port ${port}`);
})
