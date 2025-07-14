// 基本後端註冊/登入 API 實作，含 JWT 與 bcrypt
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB 連線
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petmap');

mongoose.connection.on('connected', () => {
  console.log('MongoDB 連線成功');
  
  // 檢查並建立 users collection
  mongoose.connection.db.listCollections({name: 'users'}).next((err, collinfo) => {
    if (err) {
      console.error('檢查 collection 時發生錯誤:', err);
      return;
    }
    
    if (collinfo) {
      console.log('users collection 已存在');
    } else {
      // 建立 users collection
      mongoose.connection.db.createCollection('users', (err, result) => {
        if (err) {
          console.error('建立 users collection 失敗:', err);
        } else {
          console.log('users collection 建立成功');
        }
      });
    }
  });
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB 連線失敗:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  favorites: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// 圖片上傳資料夾
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  console.warn('請手動建立 public/uploads 目錄於 backend 目錄下，否則圖片無法儲存！');
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, basename + '-' + Date.now() + ext);
  }
});
const upload = multer({ storage });

// MissingPetReport Schema
const missingPetReportSchema = new mongoose.Schema({
  datetime: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // 檔名或路徑
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  userName: { type: String, required: true },
  userId: { type: String, required: true },
  status: { type: String, default: '尋找中' },
  createdAt: { type: Date, default: Date.now }
});
const MissingPetReport = mongoose.model('MissingPetReport', missingPetReportSchema);

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// JWT 中間件 - 驗證 token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// 註冊 API
app.post('/api/register', async (req, res) => {
  const { email, password, username } = req.body;
  
  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Email, password and username are required.' });
  }
  
  try {
    // 檢查 email 是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    
    // 檢查 username 是否已存在
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already taken.' });
    }
    
    // 加密密碼
    const hash = await bcrypt.hash(password, 10);
    
    // 建立新用戶
    const user = new User({ 
      email, 
      password: hash, 
      username 
    });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('註冊錯誤:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// 登入 API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  
  try {
    // 查找用戶
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    
    // 驗證密碼
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    
    // 生成 JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        username: user.username 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    // 返回 token 和用戶資料（不包含密碼）
    const userData = {
      id: user._id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt
    };
    
    res.json({ 
      token,
      user: userData,
      message: 'Login successful'
    });
  } catch (err) {
    console.error('登入錯誤:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// 驗證 token API
app.get('/api/verify', authenticateToken, async (req, res) => {
  try {
    // 查找用戶
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      valid: true, 
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('驗證錯誤:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// 獲取用戶資料 API
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error('獲取用戶資料錯誤:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// 登出 API (可選，用於記錄登出事件)
app.post('/api/logout', authenticateToken, async (req, res) => {
  try {
    // 這裡可以添加登出記錄邏輯，比如記錄登出時間等
    console.log(`用戶 ${req.user.username} 已登出`);
    
    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('登出錯誤:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// 新增寵物失蹤回報 API
app.post('/api/report-missing-pet', upload.single('image'), async (req, res) => {
  try {
    const { datetime, location, description, latitude, longitude, userName, userId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: '圖片上傳失敗' });
    }
    if (!datetime || !location || !description || !latitude || !longitude || !userName || !userId) {
      return res.status(400).json({ message: '所有欄位皆為必填' });
    }
    const report = new MissingPetReport({
      datetime,
      location,
      description,
      image: req.file.filename,
      latitude,
      longitude,
      userName,
      userId,
      status: '尋找中'
    });
    await report.save();
    res.status(201).json({ message: '回報成功' });
  } catch (err) {
    console.error('寵物失蹤回報錯誤:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// 收藏地點（加入最愛）
app.post('/api/user/favorite', authenticateToken, async (req, res) => {
  const { placeId } = req.body;
  if (!placeId) return res.status(400).json({ message: 'placeId required' });
  try {
    await User.findByIdAndUpdate(req.user.userId, { $addToSet: { favorites: placeId } });
    res.json({ message: '已加入最愛' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});
// 取消收藏地點（移除最愛）
app.delete('/api/user/favorite', authenticateToken, async (req, res) => {
  const { placeId } = req.body;
  if (!placeId) return res.status(400).json({ message: 'placeId required' });
  try {
    await User.findByIdAndUpdate(req.user.userId, { $pull: { favorites: placeId } });
    res.json({ message: '已移除最愛' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// 取得會員收藏地點（我的最愛）
app.get('/api/user/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ favorites: user.favorites || [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// 代理 Google Places API，解決 CORS 問題
app.get('/api/proxy/place-details', authenticateToken, async (req, res) => {
  const { placeId, language } = req.query;
  if (!placeId) return res.status(400).json({ message: 'placeId required' });
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
  try {
    const lang = language || 'zh-TW';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,photos,vicinity,international_phone_number,formatted_phone_number,opening_hours,current_opening_hours,rating,reviews&language=${lang}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Google API error', error: err.message, detail: err.response?.data });
    console.error('Google API error:', err.response?.data || err.message, 'url:', req.originalUrl);
  }
});

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
