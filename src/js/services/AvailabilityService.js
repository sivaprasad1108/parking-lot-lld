const { Logger } = require('../utils/Logger');

class AvailabilityService {
  constructor(parkingLotRepo) {
    this.parkingLotRepo = parkingLotRepo;
  }

  getAvailability() {
    const lot = this.parkingLotRepo.get();
    if (!lot) {
      Logger.warn('[AVAILABILITY] Parking lot not initialized');
      return [];
    }
    
    const availability = lot.floors.map(f => (
      {
        floorNo: f.floorNo,
        available: f.availableSpotsCount()
      }
    ));
    Logger.info('')
    Logger.info(`[AVAILABILITY] ${availability.map(a => `Floor ${a.floorNo}: ${a.available} spots`).join(' | ')}`);
    Logger.info('')
    return availability;
  }
}

module.exports = AvailabilityService;
