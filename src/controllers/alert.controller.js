const Alert = require('../models/Alert.model');

const getAlertsByHospital = async (req, res) => {
  try {
    const alerts = await Alert.find({ hospital: req.params.hospitalId })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: 'acknowledged' },
      { new: true }
    );
    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAlertsByHospital, acknowledgeAlert };