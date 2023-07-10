import React from 'react';
const staticText = {
  loading: 'Charging up the information superhighway...buckle up!',
};

const Loading = ({ showText = true }) => (
  <div className="loading">
    <div className="loading-spinner"></div>
    {showText && <div>{staticText.loading}</div>}
  </div>
);

export default Loading;
