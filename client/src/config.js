export const vehicleProperties = {
  amperage: {
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
  },
  setAmperage: {
    permission: 'control_charge',
    requestType: 'POST',
    componentType: 'SetVehicleProperty',
    text: 'text',
  },
  batteryLevel: {
    permission: 'read_battery',
    requestType: 'GET',
    componentType: 'VehicleProperty', //start/stop charge, setChargeLimit ??
    text: 'text to render UI component',
  },
  batteryCapacity: {
    permission: 'read_battery',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
  },
  chargeCompletion: {
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
  },
  chargeLimit: {
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
  },
  setChargeLimit: {
    permission: 'control_charge',
    requestType: 'POST',
    componentType: 'SetVehicleProperty',
    text: 'text',
  },
  chargeState: {
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'ChargeState',
    text: 'text',
  },
  engineOil: {
    permission: 'read_engine_oil',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
  },
  evRange: {
    permission: 'read_battery',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
  },
  fuel: {
    permission: 'read_fuel',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
  },
  iceRange: {
    permission: 'read_fuel',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
  },
  isPluggedIn: {
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
  },
  location: {
    permission: 'read_location',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
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
    text: 'text',
  },
  tirePressure: {
    permission: 'read_tires',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
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
    text: 'text',
  },
  wattage: {
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
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
    'amperage',
    'batteryLevel',
    'batteryCapacity',
    'chargeCompletion',
    'chargeLimit',
    'chargeState',
    'isPluggedIn',
    'evRange',
    'vin',
    'voltage',
    'wattage',
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
