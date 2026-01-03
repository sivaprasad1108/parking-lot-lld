class ParkingFloor {
  constructor(floorNo, spots = []) {
    this.floorNo = floorNo
    this.spots = spots
  }

  availableSpotsCount() {
    return this.spots.filter(s => !s.occupied).length;
  }
}

module.exports = ParkingFloor
