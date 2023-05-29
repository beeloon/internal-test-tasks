const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'app.log'); // Specify the path and filename for the log file

function redirectConsoleLogs() {
  const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

  // Save original console methods for later use
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Override console methods to redirect logs to file
  console.log = (...args) => {
    originalConsoleLog(...args);
    logStream.write(`[LOG] ${getDatePrefix()} ${args.join(' ')}\n`);
  };

  console.error = (...args) => {
    originalConsoleError(...args);
    logStream.write(`[ERROR] ${getDatePrefix()} ${args.join(' ')}\n`);
  };

  console.warn = (...args) => {
    originalConsoleWarn(...args);
    logStream.write(`[WARN] ${getDatePrefix()} ${args.join(' ')}\n`);
  };

  // Close the log stream when the app exits
  process.on('exit', () => {
    logStream.end();
  });
}

function getDatePrefix() {
  const now = new Date();
  return `[${now.toLocaleDateString()} ${now.toLocaleTimeString()}]`;
}

module.exports = {
  redirectConsoleLogs,
};
