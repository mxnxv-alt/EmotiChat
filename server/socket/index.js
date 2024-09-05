const express = require('express')
const { Server } = require('socket.io')
const  http = require('http')


const app = express()

const server = http.createServer(app)
const io = new Server(server,{
    cors : {
        origin : process.env.FRONTEND_URL,
        credentials : true
    }
})

io.on('connection',(socket)=>{
    console.log("user connected", socket.id)

    const token = socket.handshake.auth.token
    // console.log("token", token)

    //disconnect
    io.on('disconnect',()=>{
        console.log('user disconnected', socket.id)
    })
})

module.exports = {
    app,
    server
}