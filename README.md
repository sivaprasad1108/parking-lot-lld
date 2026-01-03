# Parking Lot LLD (JavaScript)

This repository contains a low-level design implementation for a smart parking lot in **JavaScript**. It applies SOLID, KISS, DRY, and YAGNI principles.

## Project Structure

The project is organized under `src/js/`:

```
src/js/
├── enums/
│   ├── AllowedSpot.js
│   ├── ParkingSpotType.js
│   ├── PaymentStatus.js
│   ├── TicketStatus.js
│   └── VehicleType.js
├── exceptions/
│   ├── InvalidTicketError.js
│   └── NoSpotAvailableError.js
├── models/
│   ├── ParkingFloor.js
│   ├── ParkingLot.js
│   ├── ParkingSpot.js
│   ├── Receipt.js
│   ├── Ticket.js
│   └── Vehicle.js
├── repositories/
│   ├── ParkingLotRepository.js
│   ├── TicketRepository.js
│   └── VehicleRepository.js
├── services/
│   ├── AvailabilityService.js
│   ├── EntryService.js
│   ├── ExitService.js
│   └── ParkingService.js
├── strategies/
│   ├── HourlyFeeStrategy.js
│   └── SizeBasedAllocation.js
├── utils/
│   ├── IdGenerator.js
│   ├── Logger.js
│   ├── ReceiptFormatter.js
│   └── TimeUtil.js
├── config.js
└── index.js
```

## Getting Started

### Install Dependencies

```bash
npm install
```

## Run Demo

Execute the JavaScript implementation directly:

```bash
npm start
```

This runs `node src/js/index.js`.

## Core Concepts

### Enums

**VehicleType**
- `MOTORCYCLE` — small vehicle
- `CAR` — standard vehicle
- `BUS` — large vehicle

**ParkingSpotType**
- `SMALL` — for motorcycles (1 space)
- `MEDIUM` — for cars (1.5 spaces)
- `LARGE` — for buses (2 spaces)

**TicketStatus**
- `ACTIVE` — vehicle currently parked
- `CLOSED` — vehicle has exited

**PaymentStatus**
- `PENDING` — fee not paid yet
- `PAID` — fee payment completed

### Data Model

For comprehensive data model documentation including detailed schema tables, class definitions, properties, methods, relationships, and data flow diagrams, see [CLASS_DIAGRAM.md](/CLASS_DIAGRAM.md).

### Services
- `EntryService` — check-in logic, spot allocation, ticket generation
- `ExitService` — check-out logic, fee calculation, spot release
- `AvailabilityService` — real-time availability per floor
- `ParkingService` — façade orchestrating all services

### Strategies (Pluggable)
- `SizeBasedAllocation` — allocates spots based on vehicle and spot type
- `HourlyFeeStrategy` — calculates fees using hourly rates (motorcycle $0.5/hr, car $1.5/hr, bus $3/hr)

### Design Patterns Applied
- **Strategy Pattern** — spot allocation and fee calculation are swappable
- **Repository Pattern** — in-memory data access (easy to swap with DB)
- **Façade Pattern** — `ParkingService` simplifies client interaction
- **Single Responsibility** — each service has one clear concern
- **Dependency Injection** — services receive dependencies via constructor

### Utilities
- `IdGenerator` — generates unique ticket/spot IDs
- `TimeUtil` — calculates duration between entry and exit
- `Logger` — standardized colored logging
- `ReceiptFormatter` — formats and displays parking receipts in a box

### Exception Handling
- `NoSpotAvailableError` — thrown when parking lot is full
- `InvalidTicketError` — thrown when exiting with invalid/closed ticket

## Logging System

The system uses a sophisticated, colored logging framework that makes the output easy to read and understand:

### Log Levels

**[INFO]** (Cyan) — General information logs
- Always displayed in cyan for consistency

**[ENTRY]** (Green) — Vehicle check-in operations
- Shows vehicle information, allocated spot, and ticket details

**[EXIT]** (Red) — Vehicle check-out operations
- Shows vehicle exit details, duration, and calculated fees

**[AVAILABILITY]** (Orange/Yellow) — Parking spot availability updates
- Displays real-time availability per floor

**[WARN]** (Yellow) — Warning messages
- Invalid operations, missing resources, etc.

**[ERROR]** (Red) — Error conditions
- System errors and exceptions

### Receipt Display

When a vehicle checks out, a formatted receipt is displayed in a beautifully styled box showing:
- Vehicle number and type
- Ticket ID and parking spot details
- Entry and exit times with date
- Parking duration in minutes
- Hourly rate for the vehicle type
- Amount due and payment status
- Professional thank you message

The receipt uses Unicode box-drawing characters and is right-aligned for visual clarity.

### Example Output

```
[INFO] === PARKING LOT SYSTEM DEMO ===
[INFO] [SETUP] Parking lot initialized with 3 floors, 50 spots per floor

[INFO] [ENTRY] Vehicle TN-01-1111 (CAR) attempting check-in
[INFO] [ENTRY] Vehicle TN-01-1111 parked at spot F1S2-#ABC123 (Floor 1). Ticket: T-XYZ789

[INFO] [AVAILABILITY] Floor 1: 48 spots | Floor 2: 50 spots | Floor 3: 50 spots

[INFO] [EXIT] Vehicle TN-01-1111 (CAR) checked out. Duration: 5min, Fee: $7.50

        ╔════════════════════════════════════════════════╗
        ║                 PARKING RECEIPT                ║
        ║                 ═══════════════                ║
        ║                                                ║
        ║ Vehicle Number      : TN-01-1111               ║
        ║ Vehicle Type        : CAR                      ║
        ║ Ticket ID           : T-MJYLY9H9151            ║
        ║ Parking Spot        : F1S2-#MJYLY9H62          ║
        ║ Floor               : 1                        ║
        ║ Entry Time          : 11:29:55 PM (1/3/2026)   ║
        ║ Exit Time           : 11:29:56 PM (1/3/2026)   ║
        ║ Duration            : 0 minutes                ║
        ║ Hourly Rate         : $1.5/hr                  ║
        ║ ────────────────────────────────────────────── ║
        ║ Amount Due          : $1.50                    ║
        ║ Payment Status      : PENDING                  ║
        ║                                                ║
        ║             Thank you for parking!             ║
        ╚════════════════════════════════════════════════╝
```

## Demo Flow

The JavaScript demo demonstrates:
1. Initialize a parking lot with 3 floors, 50 spots per floor (mixed sizes)
2. Display initial availability
3. Check in a car (allocated to first available MEDIUM/LARGE spot)
4. Check in a motorcycle (allocated to first available SMALL/MEDIUM/LARGE spot)
5. Display availability after check-ins
6. Wait for a random simulated duration (1-10 seconds)
7. Check out the car, calculate fee, release spot, and display formatted receipt
8. Display final availability

### Simulation Mode

**Time Acceleration**: This system runs in **simulation mode** for testing and demonstration purposes:

- **1 real second = 1 simulated hour**
- Each demo run uses a **random parking duration** between 1-10 seconds
- This translates to **1-10 simulated hours** of parking

**Examples:**
- 3 real seconds = 3 simulated hours
- 6 real seconds = 6 simulated minutes = 6 simulated hours = $4.5 fee for CAR
- 2 real seconds = 2 simulated minutes = 2 simulated hours = $3.00 fee for CAR

This allows you to quickly test fee calculations, spot availability updates, and receipt generation without waiting for actual hours to pass.

### Configurable Parking Lot Size

The parking lot configuration can be easily modified in [src/js/config.js](src/js/config.js):

```javascript
exports.config = {
  FLOORS: 3,              // Number of floors in the parking lot
  SPOTS_PER_FLOOR: 50     // Number of parking spots per floor
}
```

**Customize as needed:**
- Increase `FLOORS` to create a larger parking lot
- Adjust `SPOTS_PER_FLOOR` to change spot availability per floor
- Spot types are automatically distributed: SMALL, MEDIUM, LARGE based on position

**Example configurations:**
- Small lot: `FLOORS: 1, SPOTS_PER_FLOOR: 10`
- Large lot: `FLOORS: 5, SPOTS_PER_FLOOR: 100`
- High-rise: `FLOORS: 10, SPOTS_PER_FLOOR: 30`

## Extending the System

### Add a New Allocation Strategy

1. Create an object with an `allocate()` method
2. Pass it to `ParkingService` constructor

Example:
```javascript
const NearestSpotAllocation = {
  allocate(parkingLot, vehicle) {
    // allocate closest available spot
  }
};

new ParkingService(..., NearestSpotAllocation, ...);
```

### Add a New Fee Strategy

1. Create an object with a `calculate()` method
2. Pass it to `ParkingService` constructor

Example:
```javascript
const PeakHourFeeStrategy = {
  calculate(ticket) {
    // higher rates during peak hours
  }
};

new ParkingService(..., ..., PeakHourFeeStrategy);
```