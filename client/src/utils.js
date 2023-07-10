/**
 * Helper function that returns smartcar vehicle instance.
 */
const formatName = (name) => {
  const displayNames = {
    CHARGING: 'Charging',
    FULLY_CHARGED: 'Fully charged',
    NOT_CHARGING: 'Not charging',
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

/**
 * Returns array of permissions from selected properties (in config)
 */
const getPermissions = (selectedProperties, vehicleProperties) => {
  const permissions = selectedProperties.reduce((result, property) => {
    const permission = vehicleProperties[property].permission;
    if (!result.includes(permission)) {
      result.push(permission);
    }
    return result;
  }, []);

  return permissions;
};

module.exports = {
  formatName,
  timeDiff,
  getPermissions,
};
