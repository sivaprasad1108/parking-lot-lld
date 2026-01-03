class InvalidTicketError extends Error {
  constructor(message = 'Invalid ticket') {
    super(message)
    this.name = 'InvalidTicketError'
  }
}

module.exports = InvalidTicketError
