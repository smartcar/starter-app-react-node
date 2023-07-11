import React from 'react';
import { formatName, timeDiff } from '../utils';

const staticText = {
  isPluggedInStatus: (status) => (status ? 'Yes' : 'No'),
  chargeStateStatus: (status) => formatName(status),
  chargeCompletionStatus: (status) => timeDiff(status),
  batteryLevelStatus: (status) => `${status * 100}%`,
  evRangeStatus: (status) => `${status} miles`,
  chargeLimitStatus: (status) => `${status * 100}%`,
  batteryCapacityStatus: (status) => `${status} kilowatt-hours`,
  voltageStatus: (status) => `${status} volts`,
  wattageStatus: (status) => `${status} kilowatts`,
  amperageStatus: (status) => `${status} amperes`,

  odometerValue: (distance) =>
    `${distance.toLocaleString('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} miles`,
  latitude: (location) => `Lat: ${location.latitude.toFixed(4)}...`,
  longitude: (location) => `Long: ${location.longitude.toFixed(4)}...`,
  engineOilValue: (engineOil) =>
    `${(engineOil.lifeRemaining * 100).toFixed()}% remaining`,
  frontLeft: (frontLeft) => `Front left: ${frontLeft.toFixed(1)} psi`,
  frontRight: (frontRight) => `Front right: ${frontRight.toFixed(1)} psi`,
  backLeft: (backLeft) => `Back left: ${backLeft.toFixed(1)} psi`,
  backRight: (backRight) => `Back right: ${backRight.toFixed(1)} psi`,

  startCharge: 'Start charge',
  stopCharge: 'Stop charge',
  setAmperage: 'Set new amperage',
  disconnect: 'Disconnect',
  disconnectAll: 'Disconnect all',
};

export const VehicleProperty = ({ property, text }) => {
  const propertyName = Object.keys(property)[0];
  return (
    <>
      <h3>{text}</h3>
      <p>{staticText[`${propertyName}Status`](property[propertyName])}</p>
    </>
  );
};

export const SetVehicleProperty = ({
  property,
  targetProperty,
  currentValue,
  newVehicleProperty,
  setNewVehicleProperty,
  text,
  updateProperty,
}) => {
  const handlePropertyChange = (e) => {
    setNewVehicleProperty({
      ...newVehicleProperty,
      [targetProperty]: e.target.value,
    });
  };

  const handlePropertyConfirmation = () => {
    updateProperty(targetProperty, newVehicleProperty[targetProperty]);
  };

  return (
    <div className="editable-property">
      <input
        className="property-update"
        name={property}
        type="number"
        step="1"
        min="0"
        value={newVehicleProperty[targetProperty]}
        onChange={handlePropertyChange}
      />
      <button
        className="property-confirm"
        name={property}
        disabled={newVehicleProperty[targetProperty] === currentValue}
        onClick={handlePropertyConfirmation}
      >
        {text}
      </button>
    </div>
  );
};
