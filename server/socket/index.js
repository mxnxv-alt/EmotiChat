// server/socket/index.js

const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/UserModel');
const { ConversationModel, MessageModel } = require('../models/ConversationModel');

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
    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    if (user && user._id) {
        socket.join(user._id.toString());
        onlineUser.add(user._id.toString());

        io.emit('onlineUser', Array.from(onlineUser));
        console.log('User connected:', user._id);
    } else {
        console.error('Invalid user:', user);
        socket.emit('error', { message: 'Authentication failed. Disconnecting.' });
        return socket.disconnect(); // Optionally disconnect if user is invalid
    }

    // Handle 'message-page' event
    socket.on('message-page', async (userId) => {
        console.log('Received message-page event with userId:', userId);

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Invalid userId:', userId);
            socket.emit('error', { message: 'Invalid user ID.' });
            return;
        }

        try {
            const userDetails = await UserModel.findById(userId).select('-password');

            if (userDetails) {
                const payload = {
                    _id: userDetails._id,
                    name: userDetails.name,
                    email: userDetails.email,
                    profile_pic: userDetails.profile_pic,
                    online: onlineUser.has(userId),
                };
                socket.emit('message-user', payload);
            } else {
                console.error('User not found with ID:', userId);
                socket.emit('error', { message: 'User not found.' });
            }

            const getConversationMessage = await ConversationModel.findOne({
                "$or": [
                    { sender: user._id, receiver: userId },
                    { sender: userId, receiver: user._id }
                ]
            })
                .populate('message')
                .sort({ updatedAt: -1 });

            socket.emit('message', getConversationMessage?.message || []);
        } catch (err) {
            console.error('Error in message-page event:', err);
            socket.emit('error', { message: 'Internal server error.' });
        }
    });

    // Handle 'new message' event
    socket.on('new message', async (data) => {
        console.log('Received new message data:', data);

        const { sender, receiver, text, imageUrl, videoUrl, msgByUserId } = data;

        // Validate sender and receiver
        if (!sender || !receiver) {
            console.error('Sender or receiver is missing:', data);
            return socket.emit('error', { message: 'Sender or receiver is missing.' });
        }

        // Ensure sender and receiver are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
            console.error('Invalid ObjectId(s):', sender, receiver);
            return socket.emit('error', { message: 'Invalid sender or receiver ID.' });
        }

        try {
            // Check for existing conversation
            let conversation = await ConversationModel.findOne({
                "$or": [
                    { sender: sender, receiver: receiver },
                    { sender: receiver, receiver: sender }
                ]
            });

            // If no conversation exists, create one
            if (!conversation) {
                const createConversation = new ConversationModel({
                    sender: sender,
                    receiver: receiver
                });
                conversation = await createConversation.save();
            }

            // Save the message
            const message = new MessageModel({
                text: text,
                imageUrl: imageUrl,
                videoUrl: videoUrl,
                msgByUserId: msgByUserId,
            });
            const saveMessage = await message.save();

            // Update the conversation
            conversation.message.push(saveMessage._id);
            await conversation.save();

            // Populate the message before emitting
            await conversation.populate('message');

            // Emit the message to both sender and receiver
            io.to(sender).emit('message', conversation.message);
            io.to(receiver).emit('message', conversation.message);
        } catch (err) {
            console.error('Error in new message event:', err);
            socket.emit('error', { message: 'Internal server error.' });
        }
    });

    // Handle 'sidebar' event
    socket.on('sidebar', async (currentUserId) => {
        console.log("Received sidebar event with currentUserId:", currentUserId);

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
            console.error('Invalid currentUserId:', currentUserId);
            socket.emit('error', { message: 'Invalid user ID.' });
            return;
        }

        try {
            const currentUserConversation = await ConversationModel.find({
                "$or": [
                    { sender: currentUserId },
                    { receiver: currentUserId }
                ]
            })
                .sort({ updatedAt: -1 })
                .populate('message')
                .populate('sender')
                .populate('receiver');

            console.log("currentUserConversation:", currentUserConversation);

            const conversation = currentUserConversation.map((conv) => {
                const countUnseenMsg = conv.message.reduce((prev, curr) => prev + (curr.seen ? 0 : 1), 0);

                return {
                    _id: conv._id,
                    sender: conv.sender,
                    receiver: conv.receiver,
                    unseenMsg: countUnseenMsg,
                    lastMsg: conv.message[conv.message.length - 1],
                };
            });

            socket.emit('conversation', conversation);
        } catch (err) {
            console.error('Error in sidebar event:', err);
            socket.emit('error', { message: 'Internal server error.' });
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        if (user && user._id) {
            onlineUser.delete(user._id.toString());
        }
        console.log('User disconnected', socket.id);
        io.emit('onlineUser', Array.from(onlineUser));
    });
});

module.exports = {
    app,
    server,
};
