export const vehicleProperties = {
  amperage: {
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Amperage',
  },
  setAmperage: {
    permission: 'control_charge',
    requestType: 'POST',
    componentType: 'SetVehicleProperty',
    targetProperty: 'amperage',
    text: 'Set new amperage',
  },
  batteryLevel: {
    permission: 'read_battery',
    requestType: 'GET',
    componentType: 'VehicleProperty', //start/stop charge, setChargeLimit ??
    text: 'Battery level',
  },
  batteryCapacity: {
    permission: 'read_battery',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Capacity',
  },
  chargeCompletion: {
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Time to completion',
  },
  chargeLimit: {
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Charge limit',
  },
  setChargeLimit: {
    permission: 'control_charge',
    requestType: 'POST',
    componentType: 'SetVehicleProperty',
    targetProperty: 'chargeLimit',
    text: 'Set new limit',
  },
  chargeState: {
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'ChargeState',
    text: 'Current state',
  },
  engineOil: {
    permission: 'read_engine_oil',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Engine oil life',
  },
  evRange: {
    permission: 'read_battery',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Range',
  },
  fuel: {
    permission: 'read_fuel',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Fuel',
  },
  iceRange: {
    permission: 'read_fuel',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Range',
  },
  isPluggedIn: {
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Plugged in',
  },
  location: {
    permission: 'read_location',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Location',
  },
  lockUnlock: {
    permission: 'control_security',
    requestType: 'POST',
    componentType: 'LockUnlock',
    text: 'text',
  },
  odometer: {
    permission: 'read_odometer',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Odometer',
  },
  tirePressure: {
    permission: 'read_tires',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Tire Pressure',
  },
  vin: {
    permission: 'read_vin',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
  },
  voltage: {
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Voltage',
  },
  wattage: {
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Wattage',
  },
};

export const energyConfig = {
  staticText: {
    appName: 'ChargeUp',
  },
  mode: 'live', // one of ['live', 'test', 'simulated']
  unitSystem: 'imperial',
  brandSelect: 'TESLA',
  singleSelect: true,
  singleSelectVin: '??? if this is easy?',
  // required endpoints attributes, we already included this for you, no action needed from you
  vehicleProperties: [
    //need to match the keys in the root config, the order will dictate the order of the UI components
    'isPluggedIn',
    'chargeState',
    'chargeCompletion',
    'batteryLevel',
    'evRange',
    'chargeLimit',
    'setChargeLimit',
    'batteryCapacity',
    'voltage',
    'wattage',
    'amperage',
    'setAmperage',
    'vin',
  ],
};

export const buildYourOwnConfig = {
  staticText: {
    appName: 'Your App name',
  },
  mode: 'live', // one of ['live', 'test', 'simulated']
  unitSystem: 'imperial',
  brandSelect: '',
  singleSelect: false,
  singleSelectVin: '',
  // required endpoints attributes, we already included this for you, no action needed from you
  vehicleProperties: [
    //need to match the keys in the root config, the order will dictate the order of the UI components
    // does it look better with the full list of possible vehicle properties and have the developer comment out / delete or start with an empty array and have they build their own
  ],
};
