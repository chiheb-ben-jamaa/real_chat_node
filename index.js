const app = require("express")();
const http = require("http").createServer(app);

app.get("/api", (req, res) => {
  res.send("Node Server is running. Yay!!");
});

//Socket Logic
const socketio = require("socket.io")(http);

socketio.on("connection", (userSocket) => {
  console.log("new user conncted");
  var myroom = userSocket.handshake.query.uid;
  var room_id = userSocket.query;
  //TODO: client join the room:
  userSocket.join(myroom);
  console.log(myroom);

  //TODO: resive message of the user :
  userSocket.on("send_message", (data) => {
    console.log("send_message " + JSON.stringify(data));
    //replay the message to all user that connncted :
    //==> userSocket.broadcast.emit("receive_message", data);
    //TODO: replay (broadcast) the message to all user in this room (myroom):
    socketio.sockets
      .in(myroom)
      .emit("receive_message",
      data
      /*
      {
        message: data.message,
        room: data.room,
        name: data.name,
      }
      */
      );
  });

  userSocket.on("disconnect", () => {
    console.log("user disconnect !");
    //exite from room :
    userSocket.leave(myroom);
  });
});

const PORT = process.env.PORT || 1010;
http.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
