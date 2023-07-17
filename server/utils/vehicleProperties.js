const handleError = (err) => {
  return {
    error: {
      message: err.description || 'Unavailable information',
      type: err.type,
    }
  }
}

const vehicleProperties = {
  amperage: {
    endpoint: (make) => `/${make.toLowerCase()}/charge/ammeter`,
    supportedMakes: ['TESLA'],
    process: (batchResponse, make) => {
      try {
        if (make === 'TESLA') {
          return batchResponse.teslaChargeAmmeter().amperage;
        }
        throw new Error ('Unsupported make')
      } catch (err) {
        return handleError(err);
      }
    },
  },
  attributes: {
    endpoint: '/',
    process: (batchResponse) => {
      try {
        const { meta, ...remainingValues } = batchResponse.attributes();
        return remainingValues;
      } catch (err) {
        return handleError(err);
      }
    }
  },
  batteryCapacity: {
    endpoint: '/battery/capacity',
    process: (batchResponse) => {
      try {
        const batteryCapacity = batchResponse.batteryCapacity();
        return batteryCapacity.capacity;
      } catch (err) {
        return handleError(err);
      }
    },
  },
  batteryLevel: {
    endpoint: '/battery',
    process: (batchResponse) => {
      try {
        const battery = batchResponse.battery();
        return battery.percentRemaining;
      } catch (err) {
        return handleError(err);
      }
    },
  },
  chargeCompletion: {
    endpoint: (make) => `/${make.toLowerCase()}/charge/completion`,
    supportedMakes: ['CADILLAC', 'CHEVROLET', 'TESLA'],
    process: (batchResponse, make) => {
      try {
        if (make === 'CADILLAC') {
          return batchResponse.cadillacChargeCompletion().time;
        }
        if (make === 'CHEVROLET') {
          return batchResponse.chevroletChargeCompletion().time;
        }
        if (make === 'TESLA') {
          return batchResponse.teslaChargeCompletion().time;
        }
        throw new Error ('Unsupported make')
      } catch (err) {
        return handleError(err);
      }
    },
  },
  chargeLimit: {
    endpoint: '/charge/limit',
    process: (batchResponse) => {
      try {
        const chargeLimit = batchResponse.chargeLimit();
        const limit = chargeLimit.limit;
        return Math.round(Number(limit) * 100);
      } catch (err) {
        return handleError(err);
      }
    },
  },
  chargeState: {
    endpoint: '/charge',
    process: (batchResponse) => {
      try {
        const charge = batchResponse.charge();
        return charge.state;
      } catch (err) {
        return handleError(err);
      }
    },
  },
  engineOil: {
    endpoint: '/engine/oil',
    process: (batchResponse) => {
      try {
        const engineOil = batchResponse.engineOil();
        return engineOil.lifeRemaining;
      } catch (err) {
        return handleError(err);
      }
    },
  },
  evRange: {
    endpoint: '/battery',
    process: (batchResponse) => {
      try {
        const battery = batchResponse.battery();
        return battery.range;
      } catch (err) {
        return handleError(err);
      }
    },
  },
  fuel: {
    endpoint: '/fuel',
    process: (batchResponse) => {
      try {
        const { meta, ...remainingValues } = batchResponse.fuel();
        return remainingValues;
      } catch (err) {
        return handleError(err);
      }
    },
  },
  iceRange: {
    endpoint: '/fuel',
    process: (batchResponse) => {
      try {
        const fuel = batchResponse.fuel();
        return fuel.range;
      } catch (err) {
        return handleError(err);
      }
    },
  },
  isPluggedIn: {
    endpoint: '/charge',
    process: (batchResponse) => {
      try {
        const charge = batchResponse.charge();
        return charge.isPluggedIn;
      } catch (err) {
        return handleError(err);
      }
    },
  },
  location: {
    endpoint: '/location',
    process: (batchResponse) => {
      try {
        const { meta, ...remainingValues } = batchResponse.location();;
        return remainingValues;
      } catch (err) {
        return handleError(err);
      }
    },
  },
  odometer: {
    endpoint: '/odometer',
    process: (batchResponse) => {
      try {
        const odometer = batchResponse.odometer();
        return odometer.distance;
      } catch (err) {
        return handleError(err);
      }
    },
  },
  tirePressure: {
    endpoint: '/tires/pressure',
    process: (batchResponse) => {
      try {
        const { meta, ...remainingValues } = batchResponse.tirePressure();
        return remainingValues;
      } catch (err) {
        return handleError(err);
      }
    }
  },
  vin: {
    endpoint: '/vin',
    process: (batchResponse) => {
      try {
        const vin = batchResponse.vin();
        return vin.vin;
      } catch (err) {
        return handleError(err);
      }
    },
  },
  voltage: {
    endpoint: (make) => `/${make.toLowerCase()}/charge/voltmeter`,
    supportedMakes: ['CADILLAC', 'CHEVROLET', 'TESLA'],
    process: (batchResponse, make) => {
      try {
        if (make === 'CADILLAC') {
          return batchResponse.cadillacChargeVoltmeter().voltage;
        }
        if (make === 'CHEVROLET') {
          return batchResponse.chevroletChargeVoltmeter().voltage;
        }
        if (make === 'TESLA') {
          return batchResponse.teslaChargeVoltmeter().voltage;
        }
        throw new Error ('Unsupported make')
      } catch (err) {
        return handleError(err);
      }
    },
  },
  wattage: {
    endpoint: (make) => `/${make.toLowerCase()}/charge/wattmeter`,
    supportedMakes: ['TESLA'],
    process: (batchResponse, make) => {
      try {
        if (make === 'TESLA') {
          return batchResponse.teslaChargeWattmeter().wattage;
        }
        throw new Error ('Unsupported make')
      } catch (err) {
        return handleError(err);
      }
    },
  },
}

module.exports = {
  vehicleProperties,
}