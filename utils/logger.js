const logger = {
  info: (message) => console.log(`[INFO] ${message}`),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
  success: (message) => console.log(`[SUCCESS] ${message}`)
};

module.exports = logger;