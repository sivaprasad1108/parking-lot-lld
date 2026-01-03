# Parking Lot System - Complete Class Diagram

## Overview

This document provides a comprehensive class diagram for the parking lot LLD system, showing all classes, their properties, methods, and relationships.

---

## Class Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                      MODELS (Domain Entities)                   │
└─────────────────────────────────────────────────────────────────┘

Vehicle
├── Properties:
│   ├── number: string
│   └── type: VehicleType (MOTORCYCLE, CAR, BUS)
└── Methods: (none)


ParkingSpot
├── Properties:
│   ├── id: string
│   ├── type: ParkingSpotType (SMALL, MEDIUM, LARGE)
│   ├── floorNo: number
│   └── occupied: boolean
└── Methods: (none)


ParkingFloor
├── Properties:
│   ├── floorNo: number
│   └── spots: ParkingSpot[]
└── Methods:
    └── availableSpotsCount(): number


ParkingLot
├── Properties:
│   └── floors: ParkingFloor[]
└── Methods:
    ├── allSpots(): ParkingSpot[]
    └── findSpotById(id: string): ParkingSpot


Ticket
├── Properties:
│   ├── id: string
│   ├── vehicle: Vehicle
│   ├── spot: ParkingSpot
│   ├── entryTime: Date
│   ├── exitTime: Date | undefined
│   ├── status: TicketStatus (ACTIVE, CLOSED)
│   └── fee: number
└── Methods: (none)


Receipt
├── Properties:
│   ├── ticketId: string
│   ├── fee: number
│   ├── durationMinutes: number
│   └── paymentStatus: PaymentStatus (PENDING, PAID)
└── Methods: (none)


┌─────────────────────────────────────────────────────────────────┐
│                      ENUMS (Constants)                          │
└─────────────────────────────────────────────────────────────────┘

VehicleType
├── MOTORCYCLE
├── CAR
└── BUS


ParkingSpotType
├── SMALL
├── MEDIUM
└── LARGE


TicketStatus
├── ACTIVE
└── CLOSED


PaymentStatus
├── PENDING
└── PAID


AllowedSpot
├── MOTORCYCLE: [SMALL, MEDIUM, LARGE]
├── CAR: [MEDIUM, LARGE]
└── BUS: [LARGE]


┌─────────────────────────────────────────────────────────────────┐
│                    REPOSITORIES (Data Access)                   │
└─────────────────────────────────────────────────────────────────┘

ParkingLotRepository
├── Properties:
│   └── _parkingLot: ParkingLot | null
└── Methods:
    ├── save(parkingLot: ParkingLot): void
    └── get(): ParkingLot


TicketRepository
├── Properties:
│   └── _tickets: Map<string, Ticket>
└── Methods:
    ├── save(ticket: Ticket): void
    ├── get(id: string): Ticket | undefined
    └── findAll(): Ticket[]


VehicleRepository
├── Properties:
│   └── _vehicles: Map<string, Vehicle>
└── Methods:
    ├── save(vehicle: Vehicle): void
    ├── get(number: string): Vehicle | undefined
    └── findAll(): Vehicle[]


┌─────────────────────────────────────────────────────────────────┐
│                    SERVICES (Business Logic)                    │
└─────────────────────────────────────────────────────────────────┘

EntryService
├── Properties:
│   ├── parkingLotRepo: ParkingLotRepository
│   ├── ticketRepo: TicketRepository
│   ├── vehicleRepo: VehicleRepository
│   └── allocator: SizeBasedAllocation
└── Methods:
    └── checkIn(vehicle: Vehicle): Ticket
        │
        ├─ Validates parking lot exists
        ├─ Allocates spot using allocator strategy
        ├─ Throws NoSpotAvailableError if no spot
        ├─ Marks spot as occupied
        ├─ Saves vehicle to repo
        ├─ Generates ticket with unique ID
        └─ Returns ticket


ExitService
├── Properties:
│   ├── ticketRepo: TicketRepository
│   ├── parkingLotRepo: ParkingLotRepository
│   └── feeStrategy: HourlyFeeStrategy
└── Methods:
    └── checkOut(ticketId: string): Receipt
        │
        ├─ Retrieves ticket from repo
        ├─ Validates ticket exists and is ACTIVE
        ├─ Throws InvalidTicketError if invalid
        ├─ Sets exitTime to current time
        ├─ Calculates fee using feeStrategy
        ├─ Marks ticket status as CLOSED
        ├─ Frees up parking spot
        ├─ Saves updated ticket to repo
        ├─ Calculates duration using TimeUtil
        └─ Returns receipt


AvailabilityService
├── Properties:
│   └── parkingLotRepo: ParkingLotRepository
└── Methods:
    └── getAvailability(): Array<{floorNo, available}>
        │
        └─ Maps each floor to {floorNo, available count}


ParkingService (Façade)
├── Properties:
│   ├── entryService: EntryService
│   ├── exitService: ExitService
│   └── availabilityService: AvailabilityService
└── Methods:
    ├── checkIn(vehicle: Vehicle): Ticket
    ├── checkOut(ticketId: string): Receipt
    └── getAvailability(): Array<{floorNo, available}>
        │
        └─ Delegates to respective services


┌─────────────────────────────────────────────────────────────────┐
│                   STRATEGIES (Pluggable Algorithms)             │
└─────────────────────────────────────────────────────────────────┘

SizeBasedAllocation
├── Properties:
│   └── (none, stateless)
└── Methods:
    └── allocate(parkingLot: ParkingLot, vehicle: Vehicle): ParkingSpot | null
        │
        ├─ Gets allowed spot types from AllowedSpot enum
        ├─ Gets all spots from parking lot
        ├─ Iterates through spots in order
        ├─ Returns first unoccupied spot of allowed type
        └─ Returns null if no spot found


HourlyFeeStrategy
├── Properties:
│   └── ratesPerHour: { MOTORCYCLE: 0.5, CAR: 1.5, BUS: 3 }
└── Methods:
    └── calculate(ticket: Ticket): number
        │
        ├─ Calculates minutes between entry and exit
        ├─ Converts to hours (rounded up)
        ├─ Gets vehicle type from ticket
        ├─ Multiplies hours × hourly rate
        └─ Returns total fee


┌─────────────────────────────────────────────────────────────────┐
│                    UTILITIES (Helper Functions)                   │
└─────────────────────────────────────────────────────────────────┘

TimeUtil
└── Methods:
    └── minutesBetween(start: Date, end: Date): number
        │
        ├─ Calculates difference in milliseconds
        ├─ Converts to minutes
        └─ Returns non-negative result


IdGenerator
└── Methods:
    └── next(prefix: string): string
        │
        ├─ Increments internal counter
        ├─ Concatenates prefix + timestamp (base36) + counter
        └─ Returns uppercase unique ID


Logger
└── Methods:
    ├── info(...args): void
    ├── warn(...args): void
    └── error(...args): void
        │
        └─ Formats and logs messages to console


┌─────────────────────────────────────────────────────────────────┐
│                 EXCEPTIONS (Custom Errors)                      │
└─────────────────────────────────────────────────────────────────┘

NoSpotAvailableError
├── Extends: Error
└── Message: "No parking spot available"
    │
    └─ Thrown by EntryService.checkIn() when lot is full


InvalidTicketError
├── Extends: Error
└── Message: "Invalid or already closed ticket"
    │
    └─ Thrown by ExitService.checkOut() when ticket not found or closed
```

---

## Relationship Diagram

```
                    ┌──────────────┐
                    │ ParkingService│ (Façade)
                    └────┬─┬────┬──┘
                         │ │    │
         ┌───────────────┘ │    └──────────────────┐
         │                 │                       │
    ┌────▼────────┐   ┌────▼──────┐      ┌─────────▼─────────┐
    │ EntryService│   │ExitService│      │AvailabilityService│
    └────┬────────┘   └────┬──────┘      └─────────┬─────────┘
         │                 │                       │
         │ uses            │ uses                  │ uses
         │                 │                       │
         ├─────────┬───────┤                       │
         │         │       │                       │
    ┌────▼─────────▼───┐   │                       │
    │ Repositories:    │   │                       │
    │ - ParkingLotRepo │───┤                       │
    │ - TicketRepo     │───┤                       │
    │ - VehicleRepo    │───┼───────────────────────┘
    └────┬─────────────┘   │
         │                 │ uses
         │ manage          │
         │                 │
    ┌────▼─────────────┬───▼────────────────┐
    │      Models      │      Strategies    │
    ├──────────────────┼────────────────────┤
    │ - ParkingLot     │ - SizeBasedAllocion│
    │ - ParkingFloor   │ - HourlyFeeStratgy │
    │ - ParkingSpot    │                    │
    │ - Vehicle        │                    │
    │ - Ticket         │                    │
    │ - Receipt        │                    │
    └────┬─────────────┴────────────────────┘
         │
         │ uses
         │
    ┌────▼─────────────┬────────────────┐
    │    Enums         │    Utilities   │
    ├──────────────────┼────────────────┤
    │ - VehicleType    │ - TimeUtil     │
    │ - SpotType       │ - IdGenerator  │
    │ - TicketStatus   │ - Logger       │
    │ - PaymentStatus  │                │
    │ - AllowedSpot    │                │
    └──────────────────┴────────────────┘
```

---

## Data Flow

### Check-In Flow (Vehicle Entry)

```
User Input: Vehicle(number, type)
    │
    ▼
┌──────────────────────────┐
│  ParkingService.checkIn()│
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ EntryService.checkIn()   │
└──────────┬───────────────┘
           │
      ┌────┴────┐
      │          │
      ▼          ▼
  Allocator   Validate
      │       (no repo error)
      │          │
      ▼          ▼
SizeBasedAllocation
(find spot)
      │
      ▼
  [found?] ──NO──> throw NoSpotAvailableError
      │
     YES
      │
      ▼
┌─────────────────────────────┐
│ 1. Mark spot occupied       │
│ 2. Save vehicle to repo     │
│ 3. Generate ticket ID       │
│ 4. Save ticket to repo      │
│ 5. Return Ticket object     │
└─────────────────────────────┘
```

### Check-Out Flow (Vehicle Exit)

```
User Input: ticketId
    │
    ▼
┌──────────────────────────┐
│ ParkingService.checkOut()│
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ ExitService.checkOut()   │
└──────────┬───────────────┘
           │
      ┌────┴────────┐
      │             │
      ▼             ▼
  Retrieve    Validate
  Ticket     (exists & ACTIVE)
      │             │
      ▼             ▼
   [valid?] ──NO──> throw InvalidTicketError
      │
     YES
      │
      ▼
┌──────────────────────────────┐
│ 1. Set exitTime = now        │
│ 2. Calculate fee (strategy)  │
│ 3. Mark status = CLOSED      │
│ 4. Free spot (occupied=false)│
│ 5. Save ticket to repo       │
│ 6. Calculate duration        │
│ 7. Return Receipt object     │
└──────────────────────────────┘
```

### Availability Check Flow

```
User Input: (none)
    │
    ▼
┌─────────────────────────────────┐
│ ParkingService.getAvailability()│
└──────────┬──────────────────────┘
           │
           ▼
┌──────────────────────────────┐
│AvailabilityService.getAvail()│
└──────────┬───────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Get ParkingLot from repo    │
└──────────┬──────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Map each floor to:           │
│ {floorNo, available count}   │
└──────────┬───────────────────┘
           │
           ▼
  Return Array of floor stats
```

---

## Design Patterns Used

### 1. **Strategy Pattern**
   - **SizeBasedAllocation**: Pluggable spot allocation algorithm
   - **HourlyFeeStrategy**: Pluggable fee calculation algorithm
   - Easy to swap implementations without changing core logic

### 2. **Repository Pattern**
   - **ParkingLotRepository**, **TicketRepository**, **VehicleRepository**
   - Abstracts data storage (currently in-memory)
   - Easy to replace with database implementation

### 3. **Façade Pattern**
   - **ParkingService**: Simplifies client interaction
   - Hides complexity of EntryService, ExitService, AvailabilityService
   - Single entry point for all operations

### 4. **Single Responsibility Principle**
   - Each service has one clear concern:
     - EntryService: Handle vehicle entry
     - ExitService: Handle vehicle exit
     - AvailabilityService: Report availability
     - ParkingService: Orchestrate operations

### 5. **Dependency Injection**
   - Services receive dependencies via constructor
   - Promotes loose coupling and testability
   - Easy to mock dependencies in tests

---

## Summary Table

| Category | Class | Key Responsibility |
|----------|-------|-------------------|
| **Models** | Vehicle | Hold vehicle info |
| | ParkingSpot | Represent parking space |
| | ParkingFloor | Group spots by floor |
| | ParkingLot | Manage all floors |
| | Ticket | Record entry transaction |
| | Receipt | Record exit transaction |
| **Enums** | VehicleType | Define vehicle types |
| | ParkingSpotType | Define spot sizes |
| | TicketStatus | Define ticket states |
| | PaymentStatus | Define payment states |
| | AllowedSpot | Map vehicle→allowed spots |
| **Repositories** | ParkingLotRepository | Store parking lot |
| | TicketRepository | Store tickets |
| | VehicleRepository | Store vehicles |
| **Services** | EntryService | Check-in logic |
| | ExitService | Check-out logic |
| | AvailabilityService | Report availability |
| | ParkingService | Façade |
| **Strategies** | SizeBasedAllocation | Allocate spots |
| | HourlyFeeStrategy | Calculate fees |
| **Utilities** | TimeUtil | Calculate duration |
| | IdGenerator | Generate unique IDs |
| | Logger | Log messages | Receipt Formatter
| **Exceptions** | NoSpotAvailableError | Spot allocation error |
| | InvalidTicketError | Exit validation error |
