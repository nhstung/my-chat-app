const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

// Kết nối tới MongoDB Atlas
mongoose.connect('mongodb+srv://nhstung99:nhstung2403%40%40%40@cluster0.y6quevr.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB:', err));

// Định nghĩa model tin nhắn
const Message = mongoose.model('Message', {
  content: String
});

// Serve file tĩnh từ thư mục 'public'
app.use(express.static('public'));

// Xử lý socket.io
io.on('connection', (socket) => {
  // Khi user mới vào, gửi lại tin nhắn cũ
  Message.find().then(messages => {
    messages.forEach(msg => {
      socket.emit('chat message', { text: msg.content, self: false });
    });
  });

  // Khi user gửi tin nhắn mới
  socket.on('chat message', async (data) => {
    try {
      // Lưu tin nhắn vào database
      await Message.create({ content: data.text });

      // Gửi lại cho chính mình
      socket.emit('chat message', { text: data.text, self: true });

      // Gửi cho những người khác
      socket.broadcast.emit('chat message', { text: data.text, self: false });

    } catch (err) {
      console.error('Error saving message', err);
    }
  });

  console.log('A user connected');
});

// Khởi động server
http.listen(process.env.PORT || 3000, () => {
  console.log('Server listening...');
});
