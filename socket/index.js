
const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some(user => user.userId == userId) && users.push({userId, socketId})
    console.log(users)
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = async (userId) => {
    const user = await users.find(user => user.userId === userId)
    // console.log(users)
    return user
}

io.on("connection", (socket) => {
    console.log("A user connected");

    // take user id and socket id from user

    socket.on("addUser", (userId) => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected")
        removeUser(socket.id)
        io.emit("getUsers", users)
    })

    // send and get a message
    socket.on("sendMessage", async ({senderId, receiverId, text}) => {

        const user = await getUser(receiverId); 

        io.to(user?.socketId).emit("getMessage", {
            senderId,
            text
        })
    });
})