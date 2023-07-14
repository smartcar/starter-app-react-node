import { config } from './config';
/**
 * Helper function that returns smartcar vehicle instance.
 */
export const formatName = (name) => {
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
export const timeDiff = (date) => {
  const now = new Date();
  const later = new Date(date);

  const timeDiff = later - now;

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours} hr ${minutes} min`;
};

/**
 * Returns array of permissions from selected and required properties (in config)
 */
export const getPermissions = () => {
  const combinedPermissions =
    config.vehicleProperties
    .concat(config.requiredVehicleProperties)
    .filter((property) => property.permission)
    .map((property) => property.permission);
  const permissions = [...new Set(combinedPermissions)];
  return permissions;
};

/**
 * Returns an array of vehicle properties with a GET requestType
 */
export const getReadProperties = () => {
  // The attributes endpoint is handled in a separate request
  return config.vehicleProperties
    .filter((property) => property.requestType === 'GET')
    .map((property) => property.name);
};
