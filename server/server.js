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

  // socket.emit("newEmail", {
  //   from:"mike@example.com",
  //   text:"Hey, this is created on ."
  // });

  socket.emit("newEmail", {
    from:"mike@example.com",
    text:"Hey, this is created on ."
  });

  //
  // socket.on('createEmail',(newEmail)=>{
  //   console.log('create email',newEmail);
  // })


  socket.on('createMessage',(newMessage)=>{
    console.log('New message received',newMessage);
    socket.emit("newMessage",newMessage);    
  })


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
