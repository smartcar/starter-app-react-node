import React, { useEffect, useState } from 'react';
import api from '../api';
import Loading from './Loading';
import { Properties } from './Properties';

const Vehicle = ({
  info,
  disconnect,
  vehicles,
  setSelectedVehicle,
  updateProperty,
}) => {
  const { amperage, chargeLimit, id } = info;
  const attributes = vehicles.find((vehicle) => vehicle.id === id);
  const { make, model, year } = attributes;
  // If enabled, stores inputs to update respective properties e.g. setAmperage
  const [newVehicleProperty, setNewVehicleProperty] = useState({
    chargeLimit: '',
    amperage: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Resets state when vehicle is switched or if the current vehicle's status has changed
  useEffect(() => {
    if (typeof chargeLimit === 'number') {
      setNewVehicleProperty({
        ...newVehicleProperty,
        chargeLimit: chargeLimit * 100,
      });
    }

    if (typeof amperage === 'number') {
      setNewVehicleProperty({
        ...newVehicleProperty,
        amperage: amperage,
      });
    }
  }, [chargeLimit, amperage]);

  // Removes the loading screen if the vehicle has been retrieved
  useEffect(() => {
    setIsLoading(false);
  }, [id]);

  const handleVehicleChange = async (e) => {
    setIsLoading(true);
    // Obtains the selected vehicle id
    const vehicleId = e.target.value;
    const make = vehicles.find(vehicle => vehicle.id === vehicleId).make;
    const data = await api.getVehicle(vehicleId, make);
    setSelectedVehicle(data);
  };

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
          <div className="container stats">
            <Properties
              info={info}
              newVehicleProperty={newVehicleProperty}
              setNewVehicleProperty={setNewVehicleProperty}
              updateProperty={updateProperty}
              vehicles={vehicles}
              disconnect={disconnect}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Vehicle;
