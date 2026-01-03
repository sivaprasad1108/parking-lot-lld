class VehicleRepository {
  constructor() {
    this.map = new Map()

  }

  save(vehicle) {
    this.map.set(vehicle.number, vehicle)
  }

  get(number) {
    return this.map.get(number)

  }
}
module.exports = VehicleRepository
