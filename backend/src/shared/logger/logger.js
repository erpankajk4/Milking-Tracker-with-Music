const formatTimestamp = () => new Date().toISOString();

export const logger = {
  info(message, meta) {
    if (meta) {
      console.log(`[${formatTimestamp()}] [INFO] ${message}`, meta);
    } else {
      console.log(`[${formatTimestamp()}] [INFO] ${message}`);
    }
  },

  warn(message, meta) {
    if (meta) {
      console.warn(`[${formatTimestamp()}] [WARN] ${message}`, meta);
    } else {
      console.warn(`[${formatTimestamp()}] [WARN] ${message}`);
    }
  },

  error(message, error) {
    if (error) {
      console.error(`[${formatTimestamp()}] [ERROR] ${message}`, error);
    } else {
      console.error(`[${formatTimestamp()}] [ERROR] ${message}`);
    }
  }
};
