class TicketRepository {
  constructor() {
    this.tickets = new Map();
  }

  save(ticket) {
    this.tickets.set(ticket.id, ticket);

  }

  get(id) {
    return this.tickets.get(id);

  }

  findActiveByVehicleNumber(number) {
    return [...this.tickets.values()].find(ticket => {
      return ticket.status === 'ACTIVE' && ticket.vehicle?.number === number
    })
  }

}
module.exports = TicketRepository
