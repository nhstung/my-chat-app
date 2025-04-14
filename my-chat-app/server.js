const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nhstung99:nhstung2403%40%40%40@cluster0.y6quevr.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

const Message = mongoose.model('Message', {
  content: String
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('chat message', (data) => {
    // Gửi lại cho chính mình
    socket.emit('chat message', { text: data.text, self: true });

    // Gửi cho người khác
    socket.broadcast.emit('chat message', { text: data.text, self: false });
  });
});
  console.log('A user connected');

  Message.find().then(messages => {
    messages.forEach(msg => {
      socket.emit('chat message', msg.content);
    });
  });

  socket.on('chat message', (msg) => {
    const message = new Message({ content: msg });
    message.save().then(() => {
      io.emit('chat message', msg);
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

http.listen(3000, () => {
  console.log('Listening on *:3000');
});
