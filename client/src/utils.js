/**
 * Helper function that returns smartcar vehicle instance.
 */
const formatName = (name) => {
  const displayNames = {
    CHARGING: 'Charging',
    FULLY_CHARGED: 'Fully charged',
    NOT_CHARGING: 'Not charging'
  };

  return displayNames[name] || name;
};

/**
 * Obtains time between now and a later date
 * Returns time in hours and minutes
 */
const timeDiff = (date) => {
  const now = new Date();
  const later = new Date(date);

  const timeDiff = later - now;

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours} hr ${minutes} min`;
};

module.exports = {
  formatName,
  timeDiff
};
