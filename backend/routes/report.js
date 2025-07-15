const express = require('express');
const router = express.Router();
const MissingPetReport = require('../models/MissingPetReport');
const authenticateToken = require('../middleware/authenticateToken');
const upload = require('../utils/upload');

// 新增寵物失蹤回報
router.post('/report-missing-pet', upload.single('image'), async (req, res) => {
  try {
    const { datetime, location, description, latitude, longitude, userName, userId, petName } = req.body;
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
      petName: petName || '',
      status: '尋找中'
    });
    await report.save();
    res.status(201).json({ message: '回報成功' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// 取得目前用戶的所有失蹤回報
router.get('/my-missing-reports', authenticateToken, async (req, res) => {
  try {
    const reports = await MissingPetReport.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// 刪除指定失蹤回報（僅限本人）
router.delete('/my-missing-reports/:id', authenticateToken, async (req, res) => {
  try {
    const report = await MissingPetReport.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!report) return res.status(404).json({ message: 'Report not found or not authorized.' });
    await report.deleteOne();
    res.json({ message: 'Report deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 