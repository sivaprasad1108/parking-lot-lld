const EntryService = require('./EntryService');
const ExitService = require('./ExitService');
const AvailabilityService = require('./AvailabilityService');
const { Logger } = require('../utils/Logger');

class ParkingService {
  constructor(parkingLotRepo, ticketRepo, vehicleRepo, allocator, feeStrategy) {
    this.entryService = new EntryService(parkingLotRepo, ticketRepo, vehicleRepo, allocator);
    this.exitService = new ExitService(ticketRepo, parkingLotRepo, feeStrategy);
    this.availabilityService = new AvailabilityService(parkingLotRepo);
    Logger.info('[PARKING-SERVICE] Parking service initialized');
  }
}

module.exports = ParkingService;
