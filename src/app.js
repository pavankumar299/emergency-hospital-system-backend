const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

console.log('Loading logger...');
const logger = require('./middleware/logger');
console.log('Logger loaded:', typeof logger);
app.use(logger);

console.log('Loading hospital routes...');
const hospitalRoutes = require('./routes/hospital.routes');
console.log('Hospital routes loaded:', typeof hospitalRoutes);

console.log('Loading emergency routes...');
const emergencyRoutes = require('./routes/emergency.routes');
console.log('Emergency routes loaded:', typeof emergencyRoutes);

console.log('Loading alert routes...');
const alertRoutes = require('./routes/alert.routes');
console.log('Alert routes loaded:', typeof alertRoutes);
app.get('/', (req, res) => {
  console.log('Base route accessed');
  res.send('Backend is running 🚀');
});
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/alert', alertRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;