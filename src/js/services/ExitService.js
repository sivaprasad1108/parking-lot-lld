const InvalidTicketError = require('../exceptions/InvalidTicketError');
const Receipt = require('../models/Receipt');
const { TimeUtil } = require('../utils/TimeUtil');
const { PaymentStatus } = require('../enums/PaymentStatus');
const { Logger } = require('../utils/Logger');
const ReceiptFormatter = require('../utils/ReceiptFormatter');

class ExitService {
  constructor(ticketRepo, parkingLotRepo, feeStrategy) {
    this.ticketRepo = ticketRepo;
    this.parkingLotRepo = parkingLotRepo;
    this.feeStrategy = feeStrategy;
  }

  checkOut(ticketId) {
    Logger.info("")
    Logger.info(`[EXIT] Vehicle attempting check-out with ticket ${ticketId}`);
    
    const ticket = this.ticketRepo.get(ticketId);
    if (!ticket || ticket.status !== 'ACTIVE') {
      Logger.warn(`[EXIT] Invalid or closed ticket: ${ticketId}`);
      throw new InvalidTicketError();
    }
    
    ticket.exitTime = new Date();
    ticket.fee = this.feeStrategy.calculate(ticket);
    ticket.status = 'CLOSED';
    ticket.spot.occupied = false;
    this.ticketRepo.save(ticket);
    
    const duration = TimeUtil.minutesBetween(ticket.entryTime, ticket.exitTime);
    Logger.info(`[EXIT] Vehicle ${ticket.vehicle.number} (${ticket.vehicle.type}) checked out from spot ${ticket.spot.id}. Duration: ${duration}min, Fee: $${ticket.fee.toFixed(2)}`);
    
    const receipt = new Receipt(ticket.id, ticket.fee, duration, PaymentStatus.PENDING);
    
    // Print receipt in formatted box
    ReceiptFormatter.printReceipt(ticket, receipt)
    return receipt;
  }
}

module.exports = ExitService;
