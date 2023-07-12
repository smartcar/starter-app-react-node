import React from 'react';
import { formatName, timeDiff } from '../utils';
import { config } from '../config';

const staticText = {
  vin: (status) => status,
  isPluggedIn: (status) => (status ? 'Yes' : 'No'),
  chargeState: (status) => formatName(status),
  chargeCompletion: (status) => timeDiff(status),
  batteryLevel: (status) => `${status * 100}%`,
  evRange: (status) => `${status} miles`,
  chargeLimit: (status) => `${status * 100}%`,
  batteryCapacity: (status) => `${status} kilowatt-hours`,
  voltage: (status) => `${status} volts`,
  wattage: (status) => `${status} kilowatts`,
  amperage: (status) => `${status} amperes`,
  odometer: (distance) =>
    `${distance.toLocaleString('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} miles`,
  fuel: (status) => `${status.amountRemaining} gallons`,
  latitude: (latitude) => `Lat: ${latitude.toFixed(4)}...`,
  longitude: (longitude) => `Long: ${longitude.toFixed(4)}...`,
  engineOil: (engineOil) => `${(engineOil * 100).toFixed()}% remaining`,
  frontLeft: (frontLeft) => `Front left: ${frontLeft.toFixed(1)} psi`,
  frontRight: (frontRight) => `Front right: ${frontRight.toFixed(1)} psi`,
  backLeft: (backLeft) => `Back left: ${backLeft.toFixed(1)} psi`,
  backRight: (backRight) => `Back right: ${backRight.toFixed(1)} psi`,
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
  newVehicleProperty,
  setNewVehicleProperty,
  updateProperty,
  vehicles,
  disconnect,
}) => {
  const { chargeState, isPluggedIn } = info;
  const showChargeToggle = isPluggedIn && chargeState !== 'FULLY_CHARGED';

  const properties = config.vehicleProperties.map((property) => {
    if (property.componentType === 'VehicleProperty') {
      return (
        <VehicleProperty
          property={{ ...property, status: info[property.name] }}
          key={property.name}
          text={property.text}
        />
      );
    } else if (property.componentType === 'VehiclePropertyList') {
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
        info[targetProperty] && (
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

  return properties;
};

/**
 *  Renders simple read only properties
 */
const VehicleProperty = ({ property, text }) => {
  return (
    <>
      <h3>{text}</h3>
      <p>{staticText[property.name](property.status)}</p>
    </>
  );
};

/**
 *  Renders read only properties with multiple values
 */
const VehiclePropertyList = ({ property, text }) => {
  const statuses = Object.entries(property.status);
  return (
    <>
      <h3>{text}</h3>
      <ul>
        {statuses.map((status) => (
          <li key={status[0]}>{staticText[status[0]](status[1])}</li>
        ))}
      </ul>
    </>
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
    setNewVehicleProperty({
      ...newVehicleProperty,
      [targetProperty]: e.target.value,
    });
  };

  // Sends request to server to update the target property
  const handlePropertyConfirmation = () => {
    updateProperty(targetProperty, newVehicleProperty[targetProperty]);
  };

  return (
    <div className="editable-property">
      <input
        className="property-update"
        name={property.name}
        type="number"
        step="1"
        min="0"
        value={newVehicleProperty[targetProperty]}
        onChange={handlePropertyChange}
      />
      <button
        className="property-confirm"
        name={property.name}
        disabled={newVehicleProperty[targetProperty] === currentValue}
        onClick={handlePropertyConfirmation}
      >
        {text}
      </button>
    </div>
  );
};

/**
 *  Renders lock/unlock buttons
 */
const LockUnlock = ({ updateProperty }) => {
  return (
    <div className="temporary-property">
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
    <div className="temporary-property">
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
    <div>
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
