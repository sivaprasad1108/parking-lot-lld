class Receipt {
  constructor(ticketId, fee, durationMinutes, paymentStatus) {
    this.ticketId = ticketId
    this.fee = fee
    this.durationMinutes = durationMinutes
    this.paymentStatus = paymentStatus || 'PENDING'
  }
}

module.exports = Receipt
