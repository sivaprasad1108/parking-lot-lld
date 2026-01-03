class Ticket {
  constructor(id, vehicle, spot, entryTime) {
    this.id = id
    this.vehicle = vehicle
    this.spot = spot
    this.entryTime = entryTime || new Date()
    this.exitTime = undefined
    this.status = 'ACTIVE'
    this.fee = 0
  }
}
module.exports = Ticket
