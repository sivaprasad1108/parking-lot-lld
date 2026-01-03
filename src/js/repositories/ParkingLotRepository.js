class ParkingLotRepository {
  constructor() {
    this._parkingLot = null
  }

  save(parkingLot) {
    this._parkingLot = parkingLot
  }

  get() {
    return this._parkingLot
  }
}

module.exports = ParkingLotRepository
