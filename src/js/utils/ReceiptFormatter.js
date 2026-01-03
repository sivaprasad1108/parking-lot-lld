/**
 * Utility to format and display parking receipt in a nice box format
 */
const { Logger } = require('./Logger');

const COLORS = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[32m',
  CYAN: '\x1b[36m'
};

const ReceiptFormatter = {
  /**
   * Prints a receipt in a formatted box
   * @param {Object} ticket - The ticket object
   * @param {Object} receipt - The receipt object
   */
  printReceipt(ticket, receipt) {
    const boxWidth = 50;
    const borderChar = '═';
    const cornerChar = '╔';
    const cornerEnd = '╗';
    const sideChar = '║';
    const bottomLeft = '╚';
    const bottomRight = '╝';
    const leftPadding = '        '; // 8 spaces for right alignment

    const lines = [];
    
    // Title
    lines.push(this.centerText('PARKING RECEIPT', boxWidth-1));
    lines.push(this.centerText('═══════════════', boxWidth-1));
    lines.push('');
    
    // Vehicle Information
    lines.push(`Vehicle Number      : ${ticket.vehicle.number}`);
    lines.push(`Vehicle Type        : ${ticket.vehicle.type}`);
    
    // Parking Details
    lines.push(`Ticket ID           : ${ticket.id}`);
    lines.push(`Parking Spot        : ${ticket.spot.id}`);
    lines.push(`Floor               : ${ticket.spot.floorNo}`);
    
    const entryTime = ticket.entryTime.toLocaleTimeString();
    const exitTime = ticket.exitTime.toLocaleTimeString();
    const entryDate = ticket.entryTime.toLocaleDateString();
    const exitDate = ticket.exitTime.toLocaleDateString(); 
    
    lines.push(`Entry Time          : ${entryTime} (${entryDate})`);
    lines.push(`Exit Time           : ${exitTime} (${exitDate})`);
    
    const hours = (receipt.durationMinutes / 60).toFixed(1);
    const durationDisplay = `${receipt.durationMinutes} minutes (${hours} hr(s))`;
    lines.push(`Duration            : ${durationDisplay}`);
    
    // Fee Information
    lines.push(`Hourly Rate         : $${this.getHourlyRate(ticket.vehicle.type)}/hr`);
    lines.push('─'.repeat(boxWidth - 4));
    lines.push(`Amount Due          : $${receipt.fee.toFixed(2)}`);
    lines.push(`Payment Status      : ${receipt.paymentStatus}`);
    lines.push('');
    
    lines.push(this.centerText('Thank you for parking!', boxWidth-1));

    // Print with colors and right alignment
    console.log(COLORS.GREEN);
    console.log(leftPadding + cornerChar + borderChar.repeat(boxWidth - 2) + cornerEnd);
    
    for (const line of lines) {
      const padding = boxWidth - line.length - 2;
      console.log(leftPadding + sideChar + ' ' + line + ' '.repeat(Math.max(0, padding-1)) + sideChar);
    }
    
    console.log(leftPadding + bottomLeft + borderChar.repeat(boxWidth - 2) + bottomRight);
    console.log(COLORS.RESET);
  },

  /**
   * Center text within a given width
   */
  centerText(text, width) {
    const padding = Math.max(0, width - text.length - 2);
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
  },

  /**
   * Get hourly rate for vehicle type
   */
  getHourlyRate(vehicleType) {
    const rates = {
      MOTORCYCLE: 0.5,
      CAR: 1.5,
      BUS: 3.0
    };
    return rates[vehicleType] || 1.5;
  }
};

module.exports = ReceiptFormatter;
