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
      setIsLoading(false);
      setError(null);
      setVehicles(data.vehicles);
      setSelectedVehicle(data.selectedVehicle);
    } catch (error) {
      const errorMessage = error.response.data.error;
      setError(new Error(errorMessage));
      setIsLoading(false);
    }
  };

  const smartcar = new Smartcar({
    clientId: process.env.REACT_APP_CLIENT_ID,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    // set scope of permissions: https://smartcar.com/docs/api/#permissions
    scope: ['read_vehicle_info', ...getPermissions()],
    mode: config.mode, // one of ['live', 'test', 'simulated']
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
      // only allow users to authenticate ONE vehicle specified by VIN
      singleSelectVin: config.singleSelectVin,
    });

  const disconnect = async (e) => {
    try {
      if (e.target.name === 'disconnect') {
        const vehicleId = selectedVehicle.id;
        await api.disconnect(vehicleId);
      } else {
        await api.disconnectAll();
      }
      setError(null);
      setSelectedVehicle({});
    } catch (error) {
      const errorMessage = error.response.data.error;
      setError(new Error(errorMessage));
    }
  };

  const controlCharge = async (action) => {
    try {
      const vehicleId = selectedVehicle.id;
      const { data } = await api.controlCharge(vehicleId, action);
      setSelectedVehicle({
        ...selectedVehicle,
        chargeState: data.chargeState,
      });
      setError(null);
    } catch (error) {
      const errorMessage = error.response.data.error;
      setError(new Error(errorMessage));
    }
  };

  const setChargeLimit = async (limit) => {
    try {
      const vehicleId = selectedVehicle.id;
      const { data } = await api.setChargeLimit(vehicleId, limit / 100);
      setSelectedVehicle({
        ...selectedVehicle,
        chargeLimit: data.limit,
      });
      setError(null);
    } catch (error) {
      const errorMessage = error.response.data.error;
      setError(new Error(errorMessage));
    }
  };

  const setAmperage = async (amperage) => {
    try {
      const vehicleId = selectedVehicle.id;
      const { data } = await api.setAmperage(vehicleId, amperage);
      setSelectedVehicle({
        ...selectedVehicle,
        amperage: data.amperage,
      });
      setError(null);
    } catch (error) {
      const errorMessage = error.response.data.error;
      setError(new Error(errorMessage));
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content">
        <h1>{config.staticText.appName}</h1>
        {isLoading && <Loading />}
        {!isLoading &&
          (Object.keys(selectedVehicle).length !== 0 ? (
            <>
              <Vehicle
                info={selectedVehicle}
                disconnect={disconnect}
                vehicles={vehicles}
                setSelectedVehicle={setSelectedVehicle}
                controlCharge={controlCharge}
                setChargeLimit={setChargeLimit}
                setAmperage={setAmperage}
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
