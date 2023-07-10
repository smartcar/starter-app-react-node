import React from 'react';
const staticText = {
  connectVehicle: "Connect your vehicle to get started.",
  connectButton: "Connect"
}

const Connect = ({ onClick }) => (
  <div className='container connect'>
    <p className='cta'>{staticText.connectVehicle}</p>
    <button className='connect' onClick={onClick}>{staticText.connectButton}</button>
  </div>
);

export default Connect;
