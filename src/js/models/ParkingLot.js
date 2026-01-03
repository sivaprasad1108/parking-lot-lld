class ParkingLot {
  constructor(floors = []) {
    this.floors = floors
  }

  allSpots() {
    return this.floors.reduce((acc, f) => acc.concat(f.spots), [])
  }

  findSpotById(id) {
    return this.allSpots().find(s.id === id)
  }
}
module.exports = ParkingLot
