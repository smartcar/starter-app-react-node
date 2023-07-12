import React, { useEffect, useState } from 'react';
import api from '../api';
import Loading from './Loading';
import { config } from '../config';
import {
  LockUnlock,
  SetVehicleProperty,
  StartStopCharge,
  VehicleProperty,
  VehiclePropertyList,
} from './Properties';

const text = {
  disconnect: 'Disconnect',
  disconnectAll: 'Disconnect all',
};

const Vehicle = ({
  info,
  disconnect,
  vehicles,
  setSelectedVehicle,
  updateProperty,
}) => {
  const { amperage, chargeLimit, chargeState, id, isPluggedIn } = info;
  const attributes = vehicles.find((vehicle) => vehicle.id === id);
  const { make, model, year } = attributes;
  const showChargeToggle =
    isPluggedIn &&
    chargeState !== 'FULLY_CHARGED' &&
    config.vehicleProperties.some(
      (property) => property.name === 'startStopCharge'
    );
  // If enabled, stores inputs to update respective properties e.g. setAmperage
  const [newVehicleProperty, setNewVehicleProperty] = useState({
    chargeLimit: '',
    amperage: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Resets state when vehicle is switched or if the current vehicle's status has changed
  useEffect(() => {
    setNewVehicleProperty({
      chargeLimit: chargeLimit * 100,
      amperage: amperage,
    });
  }, [chargeLimit, amperage]);

  // Removes the loading screen if the vehicle has been retrieved
  useEffect(() => {
    setIsLoading(false);
  }, [id]);

  const handleVehicleChange = async (e) => {
    setIsLoading(true);
    // Obtains the selected vehicle id
    const data = await api.getVehicle(e.target.value);
    setSelectedVehicle(data);
  };

  // Map through properties listed in config and display respective information
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
      return <LockUnlock updateProperty={updateProperty} />;
    } else if (
      property.componentType === 'StartStopCharge' &&
      showChargeToggle
    ) {
      return (
        <StartStopCharge
          updateProperty={updateProperty}
          chargeState={chargeState}
        />
      );
    } else {
      return null;
    }
  });

  return (
    <div className="container vehicle">
      {/* Renders a select dropdown if multiple vehicles are connected */}
      {vehicles.length === 1 ? (
        <h2>
          {year} {make} {model}
        </h2>
      ) : (
        <div>
          <select className="vehicles" onChange={handleVehicleChange}>
            {vehicles.map((vehicle) => (
              <option value={vehicle.id} key={vehicle.id}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </option>
            ))}
          </select>
        </div>
      )}
      {isLoading ? (
        <Loading showText={false} />
      ) : (
        <>
          <div className="container stats">{properties}</div>
          <div>
            <button
              className="disconnect"
              name="disconnect"
              onClick={disconnect}
            >
              {text.disconnect}
            </button>
            {vehicles.length > 1 && (
              <button
                className="disconnect"
                name="disconnectAll"
                onClick={disconnect}
              >
                {text.disconnectAll}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Vehicle;
