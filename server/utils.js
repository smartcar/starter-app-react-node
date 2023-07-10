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

const getVehicleInfo = async (vehicleId, accessToken) => {
  const vehicle = createSmartcarVehicle(vehicleId, accessToken);
  const [
    vin,
    charge,
    chargeCompletion,
    battery,
    chargeLimit,
    batteryCapacity,
    voltage,
    wattage,
    amperage,
  ] = await Promise.allSettled([
    vehicle.vin(),
    vehicle.charge(),
    vehicle.request('GET', 'tesla/charge/completion'),
    vehicle.battery(),
    vehicle.getChargeLimit(),
    vehicle.batteryCapacity(),
    vehicle.request('GET', 'tesla/charge/voltmeter'),
    vehicle.request('GET', 'tesla/charge/wattmeter'),
    vehicle.request('GET', 'tesla/charge/ammeter')
  ]);

  return {
    id: vehicleId,
    vin: handleSettlement(vin, 'vin'),
    isPluggedIn: handleSettlement(charge, 'isPluggedIn'),
    chargeState: handleSettlement(charge, 'state'),
    chargeCompletion: handleSettlement(chargeCompletion, 'body.time'),
    batteryLevel: handleSettlement(battery, 'percentRemaining'),
    range: handleSettlement(battery, 'range'),
    chargeLimit: handleSettlement(chargeLimit, 'limit'),
    batteryCapacity: handleSettlement(batteryCapacity, 'capacity'),
    voltage: handleSettlement(voltage, 'body.voltage'),
    wattage: handleSettlement(wattage, 'body.wattage'),
    amperage: handleSettlement(amperage, 'body.amperage'),
  }
}


module.exports = {
  createSmartcarVehicle,
  getAccess,
  getVehicleInfo,
  getVehiclesWithAttributes,
  handleSettlement,
};
