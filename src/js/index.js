// models
const ParkingSpot = require('./models/ParkingSpot');
const ParkingFloor = require('./models/ParkingFloor');
const ParkingLot = require('./models/ParkingLot');
const Vehicle = require('./models/Vehicle');

// repositories
const ParkingLotRepository = require('./repositories/ParkingLotRepository');
const TicketRepository = require('./repositories/TicketRepository');
const VehicleRepository = require('./repositories/VehicleRepository');

// services
const SizeBasedAllocation = require('./strategies/SizeBasedAllocation');
const HourlyFeeStrategy = require('./strategies/HourlyFeeStrategy');
const ParkingService = require('./services/ParkingService');

// enums
const ParkingSpotType = require('./enums/ParkingSpotType').ParkingSpotType
const VehicleType = require('./enums/VehicleType').VehicleType;

// utils
const IdGenerator = require('./utils/IdGenerator').IdGenerator;
const Logger = require('./utils/Logger').Logger;

// config
const config = require('./config').config


function buildSampleLot() {
  const floors = [];
  for (let f = 1; f <= config.FLOORS; f++) {
    const spots = [];
    for (let i = 1; i <= config.SPOTS_PER_FLOOR; i++) {
      const id = IdGenerator.next(`F${f}S${i}-#`);
      const type = i < 2 ? ParkingSpotType.SMALL : i < 4 ? ParkingSpotType.MEDIUM : ParkingSpotType.LARGE;
      spots.push(new ParkingSpot(id, type, f));
    }
    floors.push(new ParkingFloor(f, spots));
  }
  return new ParkingLot(floors);
}

async function main() {
  Logger.info('=== PARKING LOT SYSTEM SIMULATION ===');
  Logger.info('');
  
  const parkingLotRepo = new ParkingLotRepository();
  const ticketRepo = new TicketRepository();
  const vehicleRepo = new VehicleRepository();

  const lot = buildSampleLot();
  parkingLotRepo.save(lot);
  
  Logger.info(`[SETUP] Parking lot initialized with ${config.FLOORS} floors, ${config.SPOTS_PER_FLOOR} spots per floor\n`);

  const parkingService = new ParkingService(parkingLotRepo, ticketRepo, vehicleRepo, new SizeBasedAllocation(), new HourlyFeeStrategy());

  parkingService.availabilityService.getAvailability();

  const v1 = new Vehicle('TN-01-1111', VehicleType.CAR);
  const ticket1 = parkingService.entryService.checkIn(v1);

  const v2 = new Vehicle('TN-02-2222', VehicleType.MOTORCYCLE);
  const ticket2 = parkingService.entryService.checkIn(v2);

  parkingService.availabilityService.getAvailability();

  const randomWaitTime = (Math.floor(Math.random() * 10) + 1) * 1000;
  await new Promise(resolve => setTimeout(resolve, randomWaitTime));

  parkingService.exitService.checkOut(ticket1.id);

  parkingService.availabilityService.getAvailability();
  Logger.warn('NOTE: This is a simulation where 1 real second = 1 simulated hour');
  Logger.info('\n===COMPLETED ===');
}

main().catch(err => Logger.error('[ERROR]', err.message));
