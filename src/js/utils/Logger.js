// ANSI color codes
const COLORS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[36m'    // Cyan for default
};

// Map log patterns to colors
const LOG_COLOR_MAP = {
  '[ENTRY]': COLORS.GREEN,
  '[EXIT]': COLORS.RED,
  '[AVAILABILITY]': COLORS.YELLOW
};

function getColorForLog(args) {
  const firstArg = args[0]?.toString() || '';
  
  for (const [pattern, color] of Object.entries(LOG_COLOR_MAP)) {
    if (firstArg.includes(pattern)) {
      return color;
    }
  }
  
  return COLORS.BLUE;
}

function formatArgs(args) {
  return args.map(a =>
    typeof a === 'object' && a !== null
      ? JSON.stringify(a, null, 1)
      : a
  );
}

exports.Logger = {
  info(...args) {
    const color = getColorForLog(args);
    console.log(COLORS.BLUE + '[INFO]' + COLORS.RESET, color, ...formatArgs(args), COLORS.RESET);
  },
  warn(...args) {
    console.warn(COLORS.YELLOW +'[WARN] ', ...formatArgs(args), COLORS.RESET);
  },
  error(...args) {
    console.error(COLORS.RED, '[ERROR]', ...formatArgs(args), COLORS.RESET);
  }
};
