// Simple size-based allocation: finds first available spot that fits vehicle
const AllowedSpot = require('../enums/AllowedSpot').AllowedSpot

class SizeBasedAllocation {
  allocate(parkingLot, vehicle) {
    const allowed = AllowedSpot[vehicle.type] || AllowedSpot['CAR']
    const spots = parkingLot.allSpots()
    for (let i = 0; i < spots.length; i++) {
      const s = spots[i]
      if (!s.occupied && allowed.indexOf(s.type) !== -1) return s
    }
    return null
  }
}

module.exports = SizeBasedAllocation
