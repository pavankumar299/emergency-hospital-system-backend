const { rankHospitals, specialityMap } = require('../services/aiRanking.service')
const { sendEmail, sendSMS } = require('../services/notification.service')
const { sendAlertToHospital } = require('../services/socket.service')
const EmergencyLog = require('../models/EmergencyLog.model')
const Alert = require('../models/Alert.model')

const dispatch = async (req, res) => {
  try {
    const { emergencyType, patientLat, patientLng } = req.body

    // Step 1 — Fetch real nearby hospitals + rank them
    const ranked = await rankHospitals(emergencyType, patientLat, patientLng)
    if (!ranked.length) {
      return res.status(404).json({ success: false, message: 'No hospitals found near this location' })
    }

    const best = ranked[0].hospital

    // Step 2 — Create alert
    const alert = await Alert.create({
      emergencyType,
      patientLocation: { lat: patientLat, lng: patientLng },
      eta: null,
      requiredUnit: specialityMap[emergencyType] || 'general',
      status: 'sent'
    })

    // Step 3 — Push socket alert to hospital dashboard
    sendAlertToHospital(best._id.toString(), {
      emergencyType,
      eta: null,
      patientLocation: { lat: patientLat, lng: patientLng },
      requiredUnit: specialityMap[emergencyType] || 'general',
      hospitalName: best.name,
    })

    // Step 4 — Send notifications
    await sendSMS({
      to: process.env.TWILIO_PHONE,
      message: `ALERT: ${emergencyType} incoming to ${best.name}. Prepare ${specialityMap[emergencyType] || 'general'} unit.`,
    })

    await sendEmail({
      to: process.env.SMTP_USER,
      subject: `Emergency Alert - ${emergencyType}`,
      body: `Hospital: ${best.name}\nEmergency: ${emergencyType}\nRequired Unit: ${specialityMap[emergencyType] || 'general'}\nPatient Location: ${patientLat}, ${patientLng}`,
    })

    // Step 5 — Log
    await EmergencyLog.create({
      emergencyType,
      patientLocation: { lat: patientLat, lng: patientLng },
      alertSent: true,
      notificationStatus: { sms: false, email: false },
    })

    res.status(200).json({
      success: true,
      bestHospital: best,
      ranked: ranked.slice(0, 5),
      route: null,
      alert,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { dispatch }