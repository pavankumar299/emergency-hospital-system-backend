const mongoose = require('mongoose');

const emergencyLogSchema = new mongoose.Schema({
  emergencyType: { type: String, required: true },
  patientLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  selectedHospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  rankedHospitals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }],
  alertSent: { type: Boolean, default: false },
  routeData: { type: Object },
  notificationStatus: {
    sms: { type: Boolean, default: false },
    email: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyLog', emergencyLogSchema);