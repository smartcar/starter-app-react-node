'use strict';
const smartcar = require('smartcar');
const jwt = require('jsonwebtoken');
const { get } = require('lodash');
const { vehicleProperties } = require('./vehicleProperties');

/**
 * Helper function that returns smartcar vehicle instance.
 *
 * @param {string} vehicleId
 * @param {string} accessToken
 * @param {string} [unitSystem=imperial] imperial or metric
 * @returns {object} vehicle
 */
const createSmartcarVehicle = (
  vehicleId,
  accessToken,
  unitSystem = 'imperial',
) => {
  return new smartcar.Vehicle(vehicleId, accessToken, { unitSystem });
};

/**
 * Helper function that extracts the access object from the session cookie.
 *
 * @param {object} req
 * @returns {object} access object with the accessToken field
 */
const getAccess = (req) => {
  const accessCookie = req.cookies?.['my-starter-app'];
  if (!accessCookie) {
    throw new Error('Access token missing in cookie');
  }
  // Decode the "my-starter-app" cookie value
  const access = jwt.verify(
    accessCookie,
    process.env.JWT_SECRET_KEY,
    );
  return access;
};

/**
 * Function to get vehicle attributes: id, make, model, year.
 *
 * @param {Array} vehicleIds list of vehicle ids
 * @param {string} accessToken 
 * @returns {object} vehicle attributes: id, make, model, year
 */
const getVehiclesWithAttributes = async (vehicleIds, accessToken) => {
  const vehiclePromises = vehicleIds.map((vehicleId) => {
    const vehicle = createSmartcarVehicle(vehicleId, accessToken);
    return vehicle.attributes();
  })
  const settlements = await Promise.allSettled(vehiclePromises);
  // TODO: handle case where attributes() throws error but we still have the vehicleId
  const vehiclesWithAttributes = settlements.map((settlement) => handleSettlement(settlement))
  return vehiclesWithAttributes;
}

/**
 * Helper function to process settled promise
 *
 * @param {object} settlement
 * @param {string} path gets value at path of settled promise
 * @param {string} errorMessage custom error message if promise is rejected
 * @param {Function} process cb function to process output
 * @returns {any}
 */
const handleSettlement = (settlement, path, errorMessage = 'Information unavailable', process) => {
  if (settlement.status === 'rejected') {
    // TODO: Implement backend error handling with settlement.reason 
    return {error: errorMessage}
  }
  let value;
  // use lodash to get nested fields
  if (path) {
    value = get(settlement.value, path);
  } else {
    let { meta, ...remainingValue } = settlement.value;
    value = remainingValue;
  }

  if (process) {
    value = process(value);
  }
  return value;
}

// You'll want to reserve this method for fetching vehicle info for the first time (onboarding)
// You may want to store this information in a database to avoid excessive api calls to Smartcar and to the vehicle
// To update data that may have gone stale, you can poll data or use our webhooks


/**
 * Helper function to process settled promise
 *
 * @param {string} vehicleId 
 * @param {string} accessToken
 * @param {Array} requestedProperties list of desired vehicle properties
 * @param {string} unitSystem imperial or metric
 * @param {string} [make] required only for brand-specific endpoints 
 * @returns {object} vehicle properties matching requestedProperties
 * 
 * You'll want to reserve this method for fetching vehicle info for the first time (onboarding)
 * And store this information in a database to avoid excessive api calls to Smartcar and to the vehicle
 * To update data that may have gone stale, you can poll data or use our webhooks
 */
const getVehicleInfo = async (vehicleId, accessToken, requestedProperties = [], unitSystem, make) => {
  const vehicleInfo = {
    id: vehicleId,
    make,
  };
  const vehicle = createSmartcarVehicle(vehicleId, accessToken, unitSystem);
  
  // Generate list of vehicle endpoints
  const endpoints = [];
  const supportedProperties = [];
  requestedProperties.forEach(requestedProperty => {
    const { supportedMakes, endpoint} = vehicleProperties[requestedProperty];
    let newEndpoint;
    if (supportedMakes && !supportedMakes.includes(make)) return;

    if (supportedMakes && supportedMakes.includes(make)) {
      newEndpoint = endpoint(make);
    } else {
      newEndpoint= endpoint;
    }
    supportedProperties.push(requestedProperty);

    if(newEndpoint && !endpoints.includes(newEndpoint)) endpoints.push(newEndpoint);
  })

  // Make batch requests, optimized to lessen load on vehicle battery
  const batchResponse = await vehicle.batch(endpoints);

  // process batchResponse, populate response body
  supportedProperties.forEach(property => {
    const { process } = vehicleProperties[property];
    const value = process(batchResponse, make);
    // omit properties with permission errors (likely incompatible endpoint)
    if (value.error && value.error.type === 'PERMISSION') return;

    vehicleInfo[property] = value;
  })
  return vehicleInfo;
}


module.exports = {
  createSmartcarVehicle,
  getAccess,
  getVehicleInfo,
  getVehiclesWithAttributes,
  handleSettlement,
};
