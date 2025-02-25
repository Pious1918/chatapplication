import app from "./app";
import { Server } from 'socket.io'

import http from 'http'

import mongoose from "mongoose";
import chatModel from "./models/chatModel";
import pollModel from "./models/pollModel";

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:4200'
    }
})
const port = process.env.SERVER_PORT || 3000
const users: any = {}

io.on('connection', (socket) => {
    console.log("You are on online")



    socket.on("join", (userId) => {
        users[userId] = socket.id;
        console.log(`user ${userId} connected with socket ${socket.id}`)
    })



    socket.on("sendMessage", async (data) => {
        console.log("received data", data)
        const { senderId, receiverId, text } = data

        try {
            const message = await chatModel.create({
                senderId,
                receiverId,
                text
            })


            console.log("message saved")


            if (users[receiverId]) {
                io.to(users[receiverId]).emit("receiveMessage", message)
            }


        } catch (error) {

        }


    })



    socket.on("joinPolls", async () => {
        console.log("joined with polling")
        const polls = await pollModel.find()
        socket.emit("pollsData", polls)
        console.log("poll data @socket", polls)
    })

    socket.on("vote", async ({ pollId, optionIndex, userId }) => {
        const poll = await pollModel.findById(pollId)
        if (!poll) return


        let previousVoteIndex = poll.votedUsers.get(userId)

        if (previousVoteIndex !== undefined) {
            // Deduct vote from previous selection
            poll.options[previousVoteIndex].votes -= 1;
        }
        poll.options[optionIndex].votes += 1
        poll.votedUsers.set(userId, optionIndex);

        await poll.save()
        console.log(`User ${userId} changed vote for poll ${pollId} to option ${optionIndex}`);

        io.emit("pollUpdated", poll); // Send updated poll data to all clients
    })


})


server.listen(port, () => {
    console.log(`Server running on ${port}`)
})