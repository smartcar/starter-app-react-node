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

const promiseGenerator = (vehicle, request) => {
  const requestMap = {
    amperage: vehicle.request('GET', 'tesla/charge/ammeter'),
    battery: vehicle.battery(),
    batteryCapacity: vehicle.batteryCapacity(),
    charge: vehicle.charge(),
    chargeCompletion: vehicle.request('GET', 'tesla/charge/completion'),
    chargeLimit: vehicle.getChargeLimit(),
    fuelTank: vehicle.fuel(),
    vin: vehicle.vin(),
    voltage: vehicle.request('GET', 'tesla/charge/voltmeter'),
    wattage: vehicle.request('GET', 'tesla/charge/wattmeter'),
  }
  return requestMap[request];
}

const vehicleProperties = {
  // this map gives us information about which smartcar api request to make
  // and how to handle the settled promise
  amperage: {
    requestName: 'amperage',
    settle: (settlement) => handleSettlement(settlement, 'body.amperage'),
  },
  batteryCapacity: {
    requestName: 'batteryCapacity',
    settle: (settlement) => handleSettlement(settlement, 'capacity'),
  },
  batteryLevel: {
    requestName: 'battery',
    settle: (settlement) => handleSettlement(settlement, 'percentRemaining'),
  },
  chargeCompletion: {
    requestName: 'chargeCompletion',
    settle: (settlement) => handleSettlement(settlement, 'body.time'),
  },
  chargeLimit: {
    requestName: 'chargeLimit',
    settle: (settlement) => handleSettlement(settlement, 'limit'),
  },
  chargeState: {
    requestName: 'charge',
    settle: (settlement) => handleSettlement(settlement, 'state'),
  },
  evRange: {
    requestName: 'battery',
    settle: (settlement) => handleSettlement(settlement, 'range'),
  },
  iceRange: {
    requestName: 'fuelTank',
    settle: (settlement) => handleSettlement(settlement, 'range'),
  },
  isPluggedIn: {
    requestName: 'charge',
    settle: (settlement) => handleSettlement(settlement, 'isPluggedIn'),
  },
  vin: {
    requestName: 'vin',
    settle: (settlement) => handleSettlement(settlement, 'vin'),
  },
  voltage: {
    requestName: 'voltage',
    settle: (settlement) => handleSettlement(settlement, 'body.voltage'),
  },
  wattage: {
    requestName: 'wattage',
    settle: (settlement) => handleSettlement(settlement, 'body.wattage'),
  },
}

// You'll want to reserve this method for fetching vehicle info for the first time (onboarding)
// You may want to store this information in a database to avoid excessive api calls to Smartcar and to the vehicle
// To update data that may have gone stale, you can poll data or use our webhooks
const getVehicleInfo = async (vehicleId, accessToken, requestedProperties = []) => {
  const vehicle = createSmartcarVehicle(vehicleId, accessToken);
  const requests = requestedProperties.map(vehicleProperty => vehicleProperties[vehicleProperty].requestName);
  const uniqueRequests = [...new Set(requests)];
  const vehiclePromises = uniqueRequests.map(request => promiseGenerator(vehicle, request));
  const settlements = await Promise.allSettled(vehiclePromises);
  const requestToSettlement = {};
  uniqueRequests.forEach((request, index) => requestToSettlement[request] = settlements[index]);

  const vehicleInfo = { id: vehicleId};
  requestedProperties.forEach(requestedProperty => {
    const vehicleProperty = vehicleProperties[requestedProperty];
    const request = vehicleProperty.requestName;
    const settlement = requestToSettlement[request];
    vehicleInfo[requestedProperty] = vehicleProperty.settle(settlement);
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
