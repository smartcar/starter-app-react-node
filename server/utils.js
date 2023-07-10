'use strict';
const smartcar = require('smartcar');
const jwt = require('jsonwebtoken');
const { get } = require('lodash');

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

const getAccess = (req) => {
  const accessCookie = req.cookies?.chargeUp;
  if (!accessCookie) {
    throw new Error('Access token missing in cookie');
  }
  // Decode the "chargeUp" cookie value
  const access = jwt.verify(
    accessCookie,
    process.env.JWT_SECRET_KEY,
    );
  return access;
};

/**
 * Helper function to process settled promise
 *
 * @param {object} settlement
 * @param {string} path gets value at path of settled promise
 * @param {string} errorMessage custom error message if promise is rejected
 * @returns {any}
 */
const handleSettlement = (settlement, path, errorMessage = 'Information unavailable') => {
  if (settlement.status === 'rejected') {
    // TODO: Implement backend error handling with settlement.reason 
    return {error: errorMessage}
  }
  // use lodash to get nested fields
  if (path) {
    return get(settlement.value, path)
  }
  // filter out "meta" field
  const { meta, ...value } = settlement.value;
  return value;
}

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

const requestName = {
  vin: 'vin',
  isPluggedIn: 'charge',
  chargeState: 'charge',
  chargeCompletion: 'chargeCompletion',
  batteryLevel: 'battery',
  range: 'battery',
  chargeLimit: 'chargeLimit',
  batteryCapacity: 'batteryCapacity',
  voltage: 'voltage',
  wattage: 'wattage',
  amperage: 'amperage',
}

const promiseGenerator = (vehicle, request) => {
  const requestMap = {
    vin: vehicle.vin(),
    charge: vehicle.charge(),
    chargeCompletion: vehicle.request('GET', 'tesla/charge/completion'),
    battery: vehicle.battery(),
    chargeLimit: vehicle.getChargeLimit(),
    batteryCapacity: vehicle.batteryCapacity(),
    voltage: vehicle.request('GET', 'tesla/charge/voltmeter'),
    wattage: vehicle.request('GET', 'tesla/charge/wattmeter'),
    amperage: vehicle.request('GET', 'tesla/charge/ammeter'),
  }
  return requestMap[request];
}

const settle = (settlement, vehicleProperty) => {
  // some request endpoints return multiple data points or as nested fields
  // we'll use handleSettlement to retrieve the piece of data we want
  const settlementMap = {
    vin: handleSettlement(settlement, 'vin'),
    isPluggedIn: handleSettlement(settlement, 'isPluggedIn'),
    chargeState: handleSettlement(settlement, 'state'),
    chargeCompletion: handleSettlement(settlement, 'body.time'),
    batteryLevel: handleSettlement(settlement, 'percentRemaining'),
    range: handleSettlement(settlement, 'range'),
    chargeLimit: handleSettlement(settlement, 'limit'),
    batteryCapacity: handleSettlement(settlement, 'capacity'),
    voltage: handleSettlement(settlement, 'body.voltage'),
    wattage: handleSettlement(settlement, 'body.wattage'),
    amperage: handleSettlement(settlement, 'body.amperage'),
  };
  return settlementMap[vehicleProperty];
}

const getVehicleInfo = async (vehicleId, accessToken, vehicleProperties = []) => {
  const vehicle = createSmartcarVehicle(vehicleId, accessToken);
  const requests = vehicleProperties.map(vehicleProperty => requestName[vehicleProperty]);
  const uniqueRequests = [...new Set(requests)];
  const vehiclePromises = uniqueRequests.map(request => promiseGenerator(vehicle, request));
  const settlements = await Promise.allSettled(vehiclePromises);
  const requestToSettlement = {};
  uniqueRequests.forEach((request, index) => requestToSettlement[request] = settlements[index]);

  const vehicleInfo = { id: vehicleId};
  vehicleProperties.forEach(vehicleProperty => {
    const request = requestName[vehicleProperty];
    const settlement = requestToSettlement[request];
    vehicleInfo[vehicleProperty] = settle(settlement, vehicleProperty);
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
