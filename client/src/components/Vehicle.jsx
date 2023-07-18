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
  setError
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
    setNewVehicleProperty({
      chargeLimit: typeof chargeLimit === 'number' ? chargeLimit : '',
      amperage: typeof amperage === 'number' ? amperage : '',
    });
  }, [chargeLimit, amperage]);

  // // Removes the loading screen if the vehicle has been retrieved
  // useEffect(() => {
  //   setIsLoading(false);
  // }, [id]);

  const handleVehicleChange = async (e) => {
    try {
      setError(null);
      setIsLoading(true);
      // Obtains the selected vehicle id
      const vehicleId = e.target.value;
      const make = vehicles.find((vehicle) => vehicle.id === vehicleId).make;
      const data = await api.getVehicle(vehicleId, make);
      setSelectedVehicle(data);
      setIsLoading(false);
    } catch (error) {
      setError(new Error(error.response?.data?.error || 'Unknown error'));
      setIsLoading(false);
    }
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
              make={make}
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
