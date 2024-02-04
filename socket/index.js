// Adil Toktarov 1155147818
// Kambar Nursulatan (1155147668)
// Mincheol Kim (1155131310)
// Byeong Hyun Park (1155149086)
// Wong Po Wa (1155161947)

const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // Check if newUserId is not null or undefined
    if (newUserId != null) {
      // Check if the user is not added previously
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
        // console.log("New User Connected", activeUsers);
      }
    }
    // Send all active users to the new user
    io.emit("get-users", activeUsers);
  });
  

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });


  // send message to a specific user
  socket.on("send-message", (data) => {
    const receiverIds = data.receiverId;

    receiverIds.forEach((receiverId) => {
      // Use filter instead of find to get all matching users
      const users = activeUsers.filter((user) => user.userId === receiverId);

      // Iterate through the arrasy of matching users and emit the message to each user
      users.forEach((user) => {
        // console.log("Sending from socket to :", receiverId);
        // console.log("Data: ", data);
        if (user) {
          io.to(user.socketId).emit("recieve-message", data);
          // console.log("Data submitted")
        }
      });
    });
  });
  
});
