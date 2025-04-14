const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

// Kết nối MongoDB (nếu có lưu tin nhắn)
mongoose.connect('mongodb+srv://nhstung99:nhstung2403%40%40%40@cluster0.y6quevr.mongodb.net/chatApp?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// (Nếu cần lưu tin nhắn, tạo model Message ở đây)
// const Message = mongoose.model('Message', new mongoose.Schema({ content: String }));

app.use(express.static('public'));

io.on('connection', (socket) => {
  // Khi nhận sự kiện đăng nhập
  socket.on('user login', (data) => {
    socket.username = data.username;
    console.log(${data.username} đã đăng nhập);
    // Phát tới tất cả người dùng thông báo rằng người đó đã vào
    io.emit('user login', { username: data.username });
  });

  // Xử lý tin nhắn chat đơn giản
  socket.on('chat message', (data) => {
    // (Nếu lưu database, lưu tin ở đây)
    io.emit('chat message', data);
  });

  console.log('A user connected');
});

http.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port 3000');
});
