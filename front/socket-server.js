const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', socket => {
  console.log('Client connected:', socket.id);

  socket.on('joinMatch', matchId => {
    socket.join(matchId);
  });

  socket.on('chatMessage', message => {
    io.to(message.matchId).emit('chatMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.SOCKET_PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.io server listening on port ${PORT}`);
});
