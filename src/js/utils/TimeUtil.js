exports.TimeUtil = {
  // Simulation mode: 1 real second = 1 simulated minute
  // (equivalent to 1 second = 1/60th of an hour)
  SIMULATION_FACTOR: 60 * 60,

  minutesBetween: function (start, end) {
    const milliseconds = end.getTime() - start.getTime();
    const actualMinutes = milliseconds / 60000; // Convert ms to actual minutes
    // Apply simulation factor: 1 real second = 1 simulated minute
    const simulatedMinutes = Math.max(1, Math.round(actualMinutes * this.SIMULATION_FACTOR));
    return simulatedMinutes;
  }
};
