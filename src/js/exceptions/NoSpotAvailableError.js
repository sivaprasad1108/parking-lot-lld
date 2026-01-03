class NoSpotAvailableError extends Error {
  constructor(message = 'No spot available for vehicle') {
    super(message)
    this.name = 'NoSpotAvailableError'
  }
}

module.exports = NoSpotAvailableError
