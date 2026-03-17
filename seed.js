const mongoose = require('mongoose');
const Hospital = require('./src/models/Hospital.model');
require('dotenv').config({ path: './.env' });

const hospitals = [
  {
    name: 'City General Hospital',
    location: { lat: 13.0827, lng: 80.2707 },
    address: 'Anna Salai, Chennai',
    specialities: ['cardiology', 'neurology', 'trauma_care'],
    icuBeds: 10,
    generalBeds: 50,
    isAvailable: true,
  },
  {
    name: 'Apollo Hospital',
    location: { lat: 13.0569, lng: 80.2425 },
    address: 'Greams Road, Chennai',
    specialities: ['cardiology', 'trauma_care'],
    icuBeds: 15,
    generalBeds: 80,
    isAvailable: true,
  },
  {
    name: 'Fortis Malar Hospital',
    location: { lat: 13.0012, lng: 80.2565 },
    address: 'Adyar, Chennai',
    specialities: ['neurology', 'trauma_care'],
    icuBeds: 5,
    generalBeds: 40,
    isAvailable: true,
  },
  {
    name: 'MIOT International',
    location: { lat: 13.0388, lng: 80.1772 },
    address: 'Manapakkam, Chennai',
    specialities: ['cardiology', 'neurology'],
    icuBeds: 8,
    generalBeds: 60,
    isAvailable: true,
  },
  {
    name: 'Stanley Medical College',
    location: { lat: 13.1121, lng: 80.2947 },
    address: 'Old Jail Road, Chennai',
    specialities: ['trauma_care', 'general'],
    icuBeds: 20,
    generalBeds: 100,
    isAvailable: true,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    await Hospital.deleteMany();
    await Hospital.insertMany(hospitals);
    console.log('Database seeded with 5 Chennai hospitals');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();