const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'app.log');

const getDatePrefix = () => {
  const now = new Date();
  return `[${now.toLocaleDateString()} ${now.toLocaleTimeString()}]`;
}

const redirectConsoleLogs = () => {
  const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

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

  process.on('exit', () => {
    logStream.end();
  });
}

module.exports = {
  redirectConsoleLogs,
};
