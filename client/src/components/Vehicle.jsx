import React, { useEffect, useState } from 'react';
import { formatName, timeDiff } from '../utils';
import api from '../api';
import Loading from './Loading';

const text = {
  startCharge: 'Start charge',
  stopCharge: 'Stop charge',
  disconnect: 'Disconnect',
  disconnectAll: 'Disconnect all',
};

const Vehicle = ({
  info,
  disconnect,
  vehicles,
  setSelectedVehicle,
  controlCharge,
  setChargeLimit,
  setAmperage,
}) => {
  const {
    amperage,
    batteryLevel,
    batteryCapacity,
    chargeCompletion,
    chargeLimit,
    chargeState,
    id,
    isPluggedIn,
    range,
    vin,
    voltage,
    wattage,
  } = info;
  const attributes = vehicles.find((vehicle) => vehicle.id === id);
  const { make, model, year } = attributes;
  const showChargeToggle = isPluggedIn && chargeState !== 'FULLY_CHARGED';
  const [newChargeLimit, setNewChargeLimit] = useState(chargeLimit * 100);
  const [newAmperage, setNewAmperage] = useState(amperage);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNewChargeLimit(chargeLimit * 100);
    setNewAmperage(amperage);
  }, [chargeLimit, amperage]);

  useEffect(() => {
    setIsLoading(false);
  }, [id]);

  const handleVehicleChange = async (e) => {
    setIsLoading(true);
    // Obtains the selected vehicle id
    const data = await api.getVehicle(e.target.value);
    setSelectedVehicle(data);
  };

  const handlePropertyChange = (e) => {
    if (e.target.name === 'charge-limit') {
      setNewChargeLimit(e.target.value);
    } else if (e.target.name === 'amperage') {
      setNewAmperage(e.target.value);
    }
  };

  const handlePropertyConfirmation = (e) => {
    if (e.target.name === 'charge-limit') {
      setChargeLimit(newChargeLimit);
    } else if (e.target.name === 'amperage') {
      setAmperage(newAmperage);
    }
  };

  return (
    <div className="container vehicle">
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
          <p>{vin}</p>
          {showChargeToggle && (
            <div>
              <button
                className="charge"
                onClick={() =>
                  controlCharge(chargeState === 'CHARGING' ? 'STOP' : 'START')
                }
              >
                {chargeState === 'CHARGING'
                  ? text.stopCharge
                  : text.startCharge}
              </button>
            </div>
          )}
          <div className="container stats">
            <h3>{text.pluggedIn}</h3>
            <p>{text.pluggedInStatus(isPluggedIn)}</p>
            <h3>{text.state}</h3>
            <p>{text.stateStatus(chargeState)}</p>
            {chargeState === 'CHARGING' && (
              <>
                <h3>{text.timeToCompletion}</h3>
                <p>{text.timeToCompletionStatus(chargeCompletion)}</p>
              </>
            )}
            <h3>{text.battery}</h3>
            <p>{text.batteryStatus(batteryLevel)}</p>
            <h3>{text.range}</h3>
            <p>{text.rangeStatus(range)}</p>
            <h3>{text.chargeLimit}</h3>
            <p>{text.chargeLimitStatus(chargeLimit)}</p>
            <div className="editable-property">
              <input
                className="property-update"
                name="charge-limit"
                type="number"
                step="1"
                min="0"
                max="100"
                value={newChargeLimit}
                onChange={handlePropertyChange}
              />
              <button
                className="property-confirm"
                name="charge-limit"
                disabled={newChargeLimit === chargeLimit}
                onClick={handlePropertyConfirmation}
              >
                {text.setChargeLimit}
              </button>
            </div>
            <h3>{text.capacity}</h3>
            <p>{text.capacityStatus(batteryCapacity)}</p>
            <h3>{text.voltage}</h3>
            <p>{text.voltageStatus(voltage)}</p>
            <h3>{text.wattage}</h3>
            <p>{text.wattageStatus(wattage)}</p>
            <h3>{text.amperage}</h3>
            <p>{text.amperageStatus(amperage)}</p>
            <div className="editable-property">
              <input
                className="property-update"
                name="amperage"
                type="number"
                step="1"
                min="0"
                value={newAmperage}
                onChange={handlePropertyChange}
              />
              <button
                className="property-confirm"
                name="amperage"
                disabled={newAmperage === amperage}
                onClick={handlePropertyConfirmation}
              >
                {text.setAmperage}
              </button>
            </div>
          </div>
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
