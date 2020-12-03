import { Socket, Server } from 'socket.io'
import { createServer } from 'http'
const app = require("express")()
const server = createServer(app)
const ioServer = new Server(server, {
    cors: {
        origin: "https://hava-simple-chat.netlify.app",

    }
})

type UserInfo = {
    name: string;
    room: string;
    // peerId: string;
}

const users: { [id: string]: UserInfo } = {}

ioServer.on("connection", (socket: Socket) => {
    socket.on("joined", (userInfo: UserInfo) => {
        console.log(userInfo.name + " has joined")
        socket.join(userInfo.room)
        users[`${socket.id}`] = userInfo;
        console.log(userInfo);
        // socket.to(userInfo.room).emit("peer", userInfo.peerId)
        // ioServer.in(userInfo.room).emit("noob", `${userInfo.name} have joined`)
        ioServer.in(userInfo.room).emit("noob", `${userInfo.name} have joined`)
    })
    socket.on("error", (err: any) => console.log(err))
    socket.on("msg", (msg: string) => {
        // socket.to(users[socket.id].room).emit("msg", { msg, id: users[socket.id].name })
        socket.to(users[socket.id].room).emit("msg", { msg, id: users[socket.id].name })
    })

    socket.on("file", (fileInfo: any) => {
        socket.to(users[socket.id].room).emit("file", { ...fileInfo, senderName: users[socket.id].name })
    })


    socket.on("disconnect", () => {
        // socket.to(users[socket.id].room).emit("peerOff", users[socket.id].peerId);
        if (users[socket.id]) {
            console.log(`${users[socket.id].name} has been disconnected`)
            delete users[socket.id]
        }
    })
})

const port = process.env.PORT || 8080;


server.listen(port, () => console.log(`server is listening at https://hava-simple-chat:${port}/`))

