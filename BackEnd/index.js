const express = require("express")
const { Server } = require("socket.io")
const http = require("http")
const cors = require("cors")

//agar backend se bhejna hai to udhar "emit" karernge 
//agar frontend se bhejna hai to udhar "emit" karenge
//agar be pe lena hai to wahan "on" karenge
//afar fe pe lena hai to wahan "on" karenge


const app = express()
app.use(cors)

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    //console.log(socket.id); // x8WIv7-mJelg7on_ALbx

    socket.on("joinRoom", room => socket.join(room) )

    socket.on("new_message", ({new_message, room}) => {
        console.log(room, new_message)
        io.in(room).emit("getLatestMessage", new_message)
    })
  });

app.get("/", (req,res) => {
    res.send("Chat App BE started.")
})

server.listen(8000, () => {
    console.log("App started at Port 8000.")
})

