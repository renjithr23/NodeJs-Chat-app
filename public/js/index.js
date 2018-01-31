var socket = io();
socket.on('connect',function () {
  console.log('Connected to server');

  // socket.emit('createEmail',{
  //   to:"jen@example.com",
  //   text:"Hey,this is Andrew"
  // })

  socket.emit('createMessage',{
    from:"jen@example.com",
    text:"Hey everyone"
  })
})

// socket.on("newEmail",function (email) {
//   console.log("New user connected",email);
// })


socket.on("newMessage",function (message) {
  console.log("New message recieved",message);
})

socket.on('disconnect',function () {
  console.log("Disconnected from server");
})
