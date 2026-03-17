const axios = require('axios')

const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const specialityMap = {
  stroke: 'neurology',
  heart_attack: 'cardiology',
  trauma: 'trauma_care',
  accident: 'trauma_care',
}

const fetchNearbyHospitals = async (lat, lng, radiusKm = 20) => {
  const radius = radiusKm * 1000
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      way["amenity"="hospital"](around:${radius},${lat},${lng});
      relation["amenity"="hospital"](around:${radius},${lat},${lng});
    );
    out center;
  `
  const response = await axios.post(
    'https://overpass-api.de/api/interpreter',
    query,
    { headers: { 'Content-Type': 'text/plain' } }
  )

  return response.data.elements.map((el) => {
    const tags = el.tags || {}
    const lat = el.lat || el.center?.lat
    const lng = el.lon || el.center?.lon

    const addressParts = [
      tags['addr:housenumber'],
      tags['addr:street'],
      tags['addr:suburb'],
      tags['addr:city'],
      tags['addr:state'],
    ].filter(Boolean)

    const address = addressParts.length > 0
      ? addressParts.join(', ')
      : `Near ${lat?.toFixed(4)}, ${lng?.toFixed(4)}`

    return {
      _id: el.id.toString(),
      name: tags.name || 'Unknown Hospital',
      location: { lat, lng },
      address,
      phone: tags.phone || tags['contact:phone'] || 'Not available',
      emergency: tags.emergency || 'yes',
      specialities: ['general'],
      icuBeds: Math.floor(Math.random() * 20) + 1,
      generalBeds: Math.floor(Math.random() * 100) + 10,
      isAvailable: true,
      source: 'openstreetmap',
    }
  }).filter((h) => h.location.lat && h.location.lng)
}

const rankHospitals = async (emergencyType, patientLat, patientLng) => {
  const hospitals = await fetchNearbyHospitals(patientLat, patientLng)

  if (!hospitals.length) {
    return []
  }

  const requiredSpeciality = specialityMap[emergencyType] || null

  const scored = hospitals.map((h) => {
    const distance = getDistanceKm(patientLat, patientLng, h.location.lat, h.location.lng)
    const bedScore = h.icuBeds > 0 ? 1 : 0
    const specialityScore = requiredSpeciality && h.specialities.includes(requiredSpeciality) ? 1 : 0
    const distanceScore = 1 / (distance + 1)
    const totalScore = distanceScore * 0.4 + bedScore * 0.35 + specialityScore * 0.25

    return {
      hospital: h,
      distance: distance.toFixed(2),
      score: totalScore
    }
  })

  return scored.sort((a, b) => b.score - a.score)
}

module.exports = { rankHospitals, specialityMap }