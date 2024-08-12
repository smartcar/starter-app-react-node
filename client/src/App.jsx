import React, { useState } from 'react';
import Smartcar from '@smartcar/auth';
import api from './api';
import './App.css';
import { getPermissions } from './utils';
import { config } from './config';

import { Connect, Vehicle, Loading } from './components';

const App = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onComplete = async (err, code, state) => {
    if (err) {
      console.log(
        'An error occurred in the Connect flow, most likely because the user denied access'
      );
      return;
    }
    try {
      setIsLoading(true);
      await api.exchangeCode(code);
      const data = await api.getVehicles();
      setVehicles(data.vehicles);
      setSelectedVehicle(data.selectedVehicle);
      setError(null);
      setIsLoading(false);
    } catch (error) {
      setError(new Error(error.response?.data?.error || 'Unknown error'));
      setIsLoading(false);
    }
  };

  const smartcar = new Smartcar({
    clientId: process.env.REACT_APP_CLIENT_ID,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    // set scope of permissions: https://smartcar.com/docs/api/#permissions
    scope: getPermissions(),
    mode: config.mode, // one of ['live', 'simulated']
    onComplete,
  });

  const authorize = () =>
    smartcar.openDialog({
      forcePrompt: true,
      // bypass car brand selection screen: https://smartcar.com/docs/api#brand-select
      vehicleInfo: {
        make: config.brandSelect,
      },
      // only allow users to authenticate ONE vehicle
      singleSelect: config.singleSelect,
    });

  const disconnect = async (e) => {
    if (e.target.name === 'disconnect') {
      try {
        const vehicleId = selectedVehicle.id;
        await api.disconnect(vehicleId);
        setIsLoading(true);
        const data = await api.getVehicles();
        setVehicles(data.vehicles);
        setSelectedVehicle(data.selectedVehicle);
        setError(null);
        setIsLoading(false);
      } catch (error) {
        setError(new Error(error.response?.data?.error || 'Unknown error'));
        setIsLoading(false);
      }
      return;
    }
    if (e.target.name === 'disconnectAll') {
      try {
        await api.disconnectAll();
        setSelectedVehicle({});
        setVehicles([]);
        return;
      } catch (error) {
        setError(new Error(error.response?.data?.error || 'Unknown error'));
      }
      // if disconnect all fails, we'll fetch any remaining vehicles
      try {
        setIsLoading(true);
        const data = await api.getVehicles();
        setIsLoading(false);
        setError(null);
        setSelectedVehicle(data.selectedVehicle);
        setVehicles(data.vehicles);
      } catch (error) {
        setError(new Error(error.response?.data?.error || 'Unknown error'));
        setIsLoading(false);
      }
    }
  };

  const updateProperty = async (property, action) => {
    try {
      const vehicleId = selectedVehicle.id;
      if (property === 'chargeState') {
        const { data } = await api.controlCharge(vehicleId, action);
        setSelectedVehicle({
          ...selectedVehicle,
          chargeState: data.chargeState,
        });
      } else if (property === 'chargeLimit') {
        const { data } = await api.setChargeLimit(vehicleId, action);
        setSelectedVehicle({
          ...selectedVehicle,
          chargeLimit: data.limit,
        });
      } else if (property === 'amperage') {
        const { data } = await api.setAmperage(vehicleId, action, selectedVehicle.make);
        setSelectedVehicle({
          ...selectedVehicle,
          amperage: data.amperage,
        });
      } else if (property === 'security') {
        const { data } = await api.security(vehicleId, action);
        console.log(data.message);
      }
      setError(null);
    } catch (error) {
      setError(new Error(error.response?.data?.error));
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content">
        <h1>{config.staticText.appName}</h1>
        {isLoading && <Loading />}
        {!isLoading &&
          ((vehicles.length > 0 && vehicles.some((vehicle) => vehicle.id === selectedVehicle.id)) ? (
            <>
              <Vehicle
                info={selectedVehicle}
                disconnect={disconnect}
                vehicles={vehicles}
                setSelectedVehicle={setSelectedVehicle}
                updateProperty={updateProperty}
                setError={setError}
              />
            </>
          ) : (
            <Connect onClick={authorize} />
          ))}
        {error && <div className="error">{error.message}</div>}
      </div>
    </div>
  );
};

export default App;
