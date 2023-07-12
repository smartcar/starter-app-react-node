import React from 'react';
import { formatName, timeDiff } from '../utils';

const staticText = {
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
};

/**
 *  Renders simple read only properties
 */
export const VehicleProperty = ({ property, text }) => {
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
export const VehiclePropertyList = ({ property, text }) => {
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
export const SetVehicleProperty = ({
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
