const NoSpotAvailableError = require('../exceptions/NoSpotAvailableError');
const Ticket = require('../models/Ticket')
const { IdGenerator } = require('../utils/IdGenerator')
const { Logger } = require('../utils/Logger');

class EntryService {
  constructor(parkingLotRepo, ticketRepo, vehicleRepo, allocator) {
    this.parkingLotRepo = parkingLotRepo;
    this.ticketRepo = ticketRepo;
    this.vehicleRepo = vehicleRepo;
    this.allocator = allocator;
  }

  checkIn(vehicle) {
    Logger.info("")
    Logger.info(`[ENTRY] Vehicle ${vehicle.number} (${vehicle.type}) attempting check-in`);
    
    const lot = this.parkingLotRepo.get()
    if (!lot) throw new Error('Parking lot not initialized')
    
    const spot = this.allocator.allocate(lot, vehicle)
    if (!spot) {
      Logger.warn(`[ENTRY] No available spot for vehicle ${vehicle.number}`);
      throw new NoSpotAvailableError();
    }
    
    spot.occupied = true;
    this.vehicleRepo.save(vehicle);
    
    const ticket = new Ticket(IdGenerator.next('T-'), vehicle, spot, new Date());
    this.ticketRepo.save(ticket);
    
    Logger.info(`[ENTRY] Vehicle ${vehicle.number} parked at spot ${spot.id} (Floor ${spot.floorNo}). Ticket: ${ticket.id}`);
    
    return ticket;
  }
}

module.exports = EntryService
