const { TimeUtil } = require('../utils/TimeUtil');

class HourlyFeeStrategy {
  constructor() {
    this.ratesPerHour = {
      MOTORCYCLE: 0.5,
      CAR: 1.5,
      BUS: 3
    }
  }

  calculate(ticket) {
    const exit = ticket.exitTime || new Date()
    const minutes = TimeUtil.minutesBetween(ticket.entryTime, exit)
    const hours = Math.ceil(minutes / 60) || 1
    const rate = this.ratesPerHour[ticket.vehicle.type]
    return hours * rate
  }
}

module.exports = HourlyFeeStrategy
