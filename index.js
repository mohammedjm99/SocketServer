const http = require('http');
const server = http.createServer();

const allowedOrigins = [
    'https://ecerest.onrender.com',
    'https://ecerest2.onrender.com'
]

const io = require('socket.io')(server, {
    cors: {
        origin: allowedOrigins,
    },
});

let users = [];

const addUser = (userId, socketId, rule) => {
    users.push({ rule, userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {

    socket.on("joinUserO", userId => {
        addUser(userId, socket.id, "user");
        console.log(users);
        console.count('joinUser');
    });

    socket.on("joinChief", userId => {
        addUser(userId, socket.id, "chief");
        console.log(users);
        console.count('joinChief');
    });

    socket.on("joinAdmin", userId => {
        addUser(userId, socket.id, "admin");
        console.log(users);
        console.count('joinAdmin');
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
        console.log(users);
        console.count('disconnect');
    });

    socket.on("addOrder", data => {
        for (const user of users) {
            if (user.rule !== 'user') socket.to(user.socketId).emit("addOrder", data)
        }
    })
});

const PORT = process.env.PORT || 8900;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});