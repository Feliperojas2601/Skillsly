function isValidTimestamp(timestamp: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(timestamp);
}

export {
  isValidTimestamp,
};