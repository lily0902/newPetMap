// 基本後端註冊/登入 API 實作，含 JWT 與 bcrypt
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// MongoDB 連線
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petmap');

mongoose.connection.on('connected', () => {
  console.log('MongoDB 連線成功');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB 連線失敗:', err);
});

// 掛載路由
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/user'));
app.use('/api', require('./routes/report'));
app.use('/api', require('./routes/googleProxy'));

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
