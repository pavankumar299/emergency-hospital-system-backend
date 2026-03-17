const Hospital = require('../models/Hospital.model');

const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });
    res.status(200).json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBeds = async (req, res) => {
  try {
    const { icuBeds, generalBeds } = req.body;
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { icuBeds, generalBeds },
      { new: true }
    );
    res.status(200).json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllHospitals, getHospitalById, updateBeds };