const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/UserModel');
const { ConversationModel, MessageModel } = require('../models/ConversationModel')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
});

const onlineUser = new Set();

io.on('connection', async (socket) => {
    console.log('User connected', socket.id);

    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);
    
    if (user && user.id) {
        socket.join(user?._id.toString());
        onlineUser.add(user?.id?.toString());

        io.emit('onlineUser', Array.from(onlineUser));
    }

    socket.on('message-page', async (userId) => {
        if (mongoose.Types.ObjectId.isValid(userId)) {
            // console.log('Selected userId:', userId);

            try {
                const userDetails = await UserModel.findById(userId).select('-password');
                
                if (userDetails) {
                    const payload = {
                        _id: userDetails?._id,
                        name: userDetails?.name,
                        email: userDetails?.email,
                        profile_pic : userDetails?.profile_pic,
                        online: onlineUser.has(userId),
                    };
                    socket.emit('message-user', payload);
                } else {
                    console.error('User not found');
                    socket.emit('error', { message: 'User not found' });
                }
            } catch (err) {
                console.error('Error fetching user details:', err);
                socket.emit('error', { message: 'Internal server error' });
            }
        } else {
            console.error('Invalid userId:', userId);
            socket.emit('error', { message: 'Invalid user ID' });
        }
    });

    socket.on('new message', async(data)=>{

        let conversation = await ConversationModel.findOne({
            "$or" : [
                { sender : data?.sender , receiver : data?.receiver },
                { sender : data?.receiver , receiver : data?.sender }
            ]
        })


        if(!conversation){
            const createConversation = await ConversationModel({
                sender : data?.sender,
                receiver : data?.receiver
            })
            conversation = await createConversation.save()
        }

        const message = new MessageModel({
            text : data.text,
            imageUrl : data.imageUrl,
            videoUrl : data.videoUrl,
            msgByUserId : data?.msgByUserId,
        })
        const saveMessage = await message.save()

        const updateConversation = await ConversationModel.updateOne({ _id : conversation?._id}, {
            "$push" : { message : saveMessage?._id}
        })

        const getConversationMessage = await ConversationModel.findOne({
            "$or" : [
                { sender : data?.sender , receiver : data?.receiver },
                { sender : data?.receiver , receiver : data?.sender }
            ]
        }).populate('message').sort({ updatedAt : -1 })

        io.to(data?.sender).emit('message', getConversationMessage.message)
        io.to(data?.receiver).emit('message', getConversationMessage.message)
    })

    socket.on('disconnect', () => {
        if (user && user.id) {
            onlineUser.delete(user.id);
        }
        console.log('User disconnected', socket.id);
    });
});

module.exports = {
    app,
    server,
};
