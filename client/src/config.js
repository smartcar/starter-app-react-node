const properties = {
  amperage: {
    name: 'amperage',
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Amperage',
  },
  setAmperage: {
    name: 'setAmperage',
    permission: 'control_charge',
    requestType: 'POST',
    componentType: 'SetVehicleProperty',
    targetProperty: 'amperage',
    text: 'Set new amperage',
  },
  batteryLevel: {
    name: 'batteryLevel',
    permission: 'read_battery',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Battery level',
  },
  batteryCapacity: {
    name: 'batteryCapacity',
    permission: 'read_battery',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Capacity',
  },
  chargeCompletion: {
    name: 'chargeCompletion',
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Time to completion',
  },
  chargeLimit: {
    name: 'chargeLimit',
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Charge limit',
  },
  setChargeLimit: {
    name: 'setChargeLimit',
    permission: 'control_charge',
    requestType: 'POST',
    componentType: 'SetVehicleProperty',
    targetProperty: 'chargeLimit',
    text: 'Set new limit',
  },
  chargeState: {
    name: 'chargeState',
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'ChargeState',
    text: 'Current state',
  },
  engineOil: {
    name: 'engineOil',
    permission: 'read_engine_oil',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Engine oil life',
  },
  evRange: {
    name: 'evRange',
    permission: 'read_battery',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Range',
  },
  fuel: {
    name: 'fuel',
    permission: 'read_fuel',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Fuel',
  },
  iceRange: {
    name: 'iceRange',
    permission: 'read_fuel',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Range',
  },
  isPluggedIn: {
    name: 'isPluggedIn',
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Plugged in',
  },
  location: {
    name: 'location',
    permission: 'read_location',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Location',
  },
  lockUnlock: {
    name: 'lockUnlock',
    permission: 'control_security',
    requestType: 'POST',
    componentType: 'LockUnlock',
    text: 'text',
  },
  odometer: {
    name: 'odometer',
    permission: 'read_odometer',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Odometer',
  },
  startStopCharge: {
    name: 'startStopCharge',
    permission: 'control_charge',
    requestType: 'POST',
    componentType: 'StartStopCharge',
    text: '',
  },
  tirePressure: {
    name: 'tirePressure',
    permission: 'read_tires',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Tire Pressure',
  },
  vin: {
    name: 'vin',
    permission: 'read_vin',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'text',
  },
  voltage: {
    name: 'voltage',
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Voltage',
  },
  wattage: {
    name: 'wattage',
    permission: 'read_charge',
    requestType: 'GET',
    componentType: 'VehicleProperty',
    text: 'Wattage',
  },
};

const energyUtilitiesConfig = {
  staticText: {
    appName: 'ChargeUp',
  },
  mode: 'test',
  unitSystem: 'imperial',
  brandSelect: 'TESLA',
  singleSelect: false,
  singleSelectVin: '',
  vehicleProperties: [
    properties.vin,
    properties.isPluggedIn,
    properties.chargeState,
    properties.chargeCompletion,
    properties.batteryLevel,
    properties.evRange,
    properties.chargeLimit,
    properties.setChargeLimit,
    properties.batteryCapacity,
    properties.voltage,
    properties.wattage,
    properties.amperage,
    properties.setAmperage,
  ],
};

const autoInsuranceConfig = {
  staticText: {
    appName: 'Sky Insurance',
  },
  mode: 'test',
  unitSystem: 'imperial',
  brandSelect: '',
  singleSelect: true,
  singleSelectVin: '',
  vehicleProperties: [
    properties.vin,
    properties.odometer,
    properties.location,
    properties.engineOil,
    properties.tirePressure,
  ],
};

const carSharingConfig = {
  staticText: {
    appName: 'CarShare',
  },
  mode: 'test',
  unitSystem: 'imperial',
  brandSelect: '',
  singleSelect: true,
  singleSelectVin: '',
  vehicleProperties: [
    properties.vin,
    properties.lockUnlock,
    properties.location,
    properties.fuel,
    properties.batteryLevel,
    properties.iceRange,
    properties.evRange,
    properties.odometer,
  ],
};

const roadsideAssistanceConfig = {
  staticText: {
    appName: 'RoadsideAssist',
  },
  mode: 'test',
  unitSystem: 'imperial',
  brandSelect: '',
  singleSelect: true,
  singleSelectVin: '',
  vehicleProperties: [
    properties.vin,
    properties.location,
    properties.odometer,
    properties.tirePressure,
    properties.engineOil,
  ],
};

const buildYourOwnConfig = {
  /**
   * Section 1: Personalize your app!
   */
  staticText: {
    appName: 'Your App name',
  },

  /**
   * Section 2: Configure the Smartcar instance and Connect flow
   * You can also do this directly where smartcar gets instantiated in App.jsx  
   */ 
  mode: 'live', // one of ['live', 'test', 'simulated']
  unitSystem: 'imperial',
  brandSelect: '',
  singleSelect: false,
  singleSelectVin: '',

  /**
   * Section 3: Build the app! Add the desired properties from the properties object. This will decide the following:
   *  1. The permissions requested from the user in the Connect flow
   *  2. The UI elements: displayed vehicle stats, vehicle action buttons
   *  3. The order of the UI layout, which matches the order in this array.
   *  4. The api methods. What car info to retrieve. What vehicle actions (ex: lock/unlock) can be made
   */
  vehicleProperties: [
    properties.vin,
    // properties.someVehicleProperty,
  ],
};

export const config = energyUtilitiesConfig;
