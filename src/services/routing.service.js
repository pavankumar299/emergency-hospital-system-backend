const axios = require('axios');

const getRoute = async (fromLat, fromLng, toLat, toLng) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&key=${process.env.MAPS_API_KEY}`;
    const response = await axios.get(url);
    const route = response.data.routes[0];

    return {
      distance: route.legs[0].distance.text,
      duration: route.legs[0].duration.text,
      durationValue: route.legs[0].duration.value,
      polyline: route.overview_polyline.points,
    };
  } catch (error) {
    console.error('Routing error:', error.message);
    return null;
  }
};

module.exports = { getRoute };