const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');

// 收藏地點
router.post('/user/favorite', authenticateToken, async (req, res) => {
  const { placeId } = req.body;
  if (!placeId) return res.status(400).json({ message: 'placeId required' });
  try {
    await User.findByIdAndUpdate(req.user.userId, { $addToSet: { favorites: placeId } });
    res.json({ message: '已加入最愛' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});
// 取消收藏地點
router.delete('/user/favorite', authenticateToken, async (req, res) => {
  const { placeId } = req.body;
  if (!placeId) return res.status(400).json({ message: 'placeId required' });
  try {
    await User.findByIdAndUpdate(req.user.userId, { $pull: { favorites: placeId } });
    res.json({ message: '已移除最愛' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});
// 取得會員收藏地點
router.get('/user/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ favorites: user.favorites || [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});
// 取得用戶資料
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user._id, email: user.email, username: user.username, createdAt: user.createdAt });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 