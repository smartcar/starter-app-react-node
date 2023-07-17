import React from 'react';
import { formatName, timeDiff } from '../utils';
import { config } from '../config';

const isMetric = config.unitSystem === 'metric';
const staticText = {
  attributes: (status) => `${status.make} ${status.model} ${status.year}`,
  vin: (status) => status,
  isPluggedIn: (status) => (status ? 'Yes' : 'No'),
  chargeState: (status) => formatName(status),
  chargeCompletion: (status) => timeDiff(status),
  batteryLevel: (status) => `${status * 100}%`,
  iceRange: (status) => `${status} ${isMetric ? 'kilometers' : 'miles'}`,
  evRange: (status) => `${status} ${isMetric ? 'kilometers' : 'miles'}`,
  chargeLimit: (status) => `${status}%`,
  batteryCapacity: (status) => `${status} kilowatt-hours`,
  voltage: (status) => `${status} volts`,
  wattage: (status) => `${status} kilowatts`,
  amperage: (status) => `${status} amperes`,
  odometer: (distance) =>
    `${distance.toLocaleString('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} ${isMetric ? 'kilometers' : 'miles'}`,
  fuel: (status) =>
    `${status.amountRemaining} ${isMetric ? 'liters' : 'gallons'}`,
  latitude: (latitude) => `Lat: ${latitude.toFixed(4)}...`,
  longitude: (longitude) => `Long: ${longitude.toFixed(4)}...`,
  engineOil: (engineOil) => `${(engineOil * 100).toFixed()}% remaining`,
  frontLeft: (frontLeft) =>
    `Front left: ${frontLeft.toFixed(1)} ${isMetric ? 'kPa' : 'psi'}`,
  frontRight: (frontRight) =>
    `Front right: ${frontRight.toFixed(1)} ${isMetric ? 'kPa' : 'psi'}`,
  backLeft: (backLeft) =>
    `Back left: ${backLeft.toFixed(1)} ${isMetric ? 'kPa' : 'psi'}`,
  backRight: (backRight) =>
    `Back right: ${backRight.toFixed(1)} ${isMetric ? 'kPa' : 'psi'}`,
  lock: 'Lock',
  unlock: 'Unlock',
  startCharge: 'Start charge',
  stopCharge: 'Stop charge',
  disconnect: 'Disconnect',
  disconnectAll: 'Disconnect all',
};

/**
 *  Map through properties listed in config and display respective information
 */
export const Properties = ({
  info,
  make,
  newVehicleProperty,
  setNewVehicleProperty,
  updateProperty,
  vehicles,
  disconnect,
}) => {
  const { chargeState, isPluggedIn } = info;
  const showChargeToggle =
    isPluggedIn
    && !isPluggedIn.error
    && chargeState
    && !chargeState.error
    && chargeState !== 'FULLY_CHARGED';

  return config.vehicleProperties.map((property) => {
    if (property.supportedMakes && !property.supportedMakes.includes(make)
    ) {
      return null;
    } else if (property.componentType === 'VehicleProperty') {
      if (info[property.name] === undefined) return null;

      return (
        <VehicleProperty
          property={{ ...property, status: info[property.name] }}
          key={property.name}
          text={property.text}
        />
      );
    } else if (property.componentType === 'VehiclePropertyList') {
      if (info[property.name] === undefined) return null;

      return (
        <VehiclePropertyList
          property={{ ...property, status: info[property.name] }}
          key={property.name}
          text={property.text}
        />
      );
    } else if (property.componentType === 'SetVehicleProperty') {
      const { targetProperty } = property;
      return (
        info[targetProperty] && !info[targetProperty].error && (
          <SetVehicleProperty
            property={property}
            key={property.name}
            targetProperty={targetProperty}
            currentValue={info[targetProperty]}
            newVehicleProperty={newVehicleProperty}
            setNewVehicleProperty={setNewVehicleProperty}
            text={property.text}
            updateProperty={updateProperty}
          />
        )
      );
    } else if (property.componentType === 'LockUnlock') {
      return <LockUnlock updateProperty={updateProperty} key={property.name} />;
    } else if (
      property.componentType === 'StartStopCharge' &&
      showChargeToggle
    ) {
      return (
        <StartStopCharge
          updateProperty={updateProperty}
          chargeState={chargeState}
          key={property.name}
        />
      );
    } else if (property.componentType === 'Disconnect') {
      return (
        <Disconnect
          vehicles={vehicles}
          disconnect={disconnect}
          key={property.name}
        />
      );
    } else {
      return null;
    }
  });
};

/**
 *  Renders simple read only properties
 */
const VehicleProperty = ({ property, text }) => {
  const status =
    property.status?.error?.message ||
    staticText[property.name](property.status);
  return (
    <div id={property.name} className="property">
      <h3>{text}</h3>
      <p>{status}</p>
    </div>
  );
};

/**
 *  Renders read only properties with multiple values
 */
const VehiclePropertyList = ({ property, text }) => {
  const statuses = Object.entries(property.status);
  return (
    <div id={property.name} className="property">
      <h3>{text}</h3>
      <ul>
        {statuses.map((status) => (
          <li key={status[0]}>{staticText[status[0]](status[1])}</li>
        ))}
      </ul>
    </div>
  );
};

/**
 *  Renders inputs to update a target property e.g. setChargeLimit -> chargeLimit
 */
const SetVehicleProperty = ({
  property,
  targetProperty,
  currentValue,
  newVehicleProperty,
  setNewVehicleProperty,
  text,
  updateProperty,
}) => {
  // Updates state with new property value to be sent to server
  const handlePropertyChange = (e) => {
    e.preventDefault();
    setNewVehicleProperty({
      ...newVehicleProperty,
      [targetProperty]: e.target.value,
    });
  };

  // Sends request to server to update the target property
  const handlePropertyConfirmation = (e) => {
    e.preventDefault();
    updateProperty(targetProperty, newVehicleProperty[targetProperty]);
  };

  return (
    <div id={property.name} className="editable-property">
      <form onSubmit={handlePropertyConfirmation}>
        <input
          className="property-update"
          name={property.name}
          value={newVehicleProperty[targetProperty]}
          onChange={handlePropertyChange}
          {...property.htmlAttributes}
        />
        <button
          type="submit"
          className="property-confirm"
          name={property.name}
          disabled={newVehicleProperty[targetProperty] === currentValue}
        >
          {text}
        </button>
      </form>
    </div>
  );
};

/**
 *  Renders lock/unlock buttons
 */
const LockUnlock = ({ updateProperty }) => {
  return (
    <div id="lockUnlock">
      <button
        className="property-action"
        name="security"
        onClick={(e) => updateProperty(e.target.name, 'LOCK')}
      >
        {staticText.lock}
      </button>
      <button
        className="property-action"
        name="security"
        onClick={(e) => updateProperty(e.target.name, 'UNLOCK')}
      >
        {staticText.unlock}
      </button>
    </div>
  );
};

/**
 *  Renders start/stop charge button
 */
const StartStopCharge = ({ updateProperty, chargeState }) => {
  return (
    <div id="startStopCharge">
      <button
        className="property-action"
        name="chargeState"
        onClick={(e) =>
          updateProperty(
            e.target.name,
            chargeState === 'CHARGING' ? 'STOP' : 'START'
          )
        }
      >
        {chargeState === 'CHARGING'
          ? staticText.stopCharge
          : staticText.startCharge}
      </button>
    </div>
  );
};

/**
 *  Renders disconnect/disconnect all button
 */
const Disconnect = ({ vehicles, disconnect }) => {
  return (
    <div id="disconnect">
      <button className="disconnect" name="disconnect" onClick={disconnect}>
        {staticText.disconnect}
      </button>
      {vehicles.length > 1 && (
        <button
          className="disconnect"
          name="disconnectAll"
          onClick={disconnect}
        >
          {staticText.disconnectAll}
        </button>
      )}
    </div>
  );
};
