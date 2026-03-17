const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  emergencyType: { type: String, required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  patientLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  eta: { type: Number },
  requiredUnit: { type: String },
  status: { type: String, enum: ['sent', 'acknowledged', 'completed'], default: 'sent' }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);