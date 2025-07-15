const mongoose = require('mongoose');

const missingPetReportSchema = new mongoose.Schema({
  datetime: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  userName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  petName: { type: String, default: '' },
  status: { type: String, default: '尋找中' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MissingPetReport', missingPetReportSchema); 