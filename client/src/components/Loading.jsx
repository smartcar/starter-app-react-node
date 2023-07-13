import React from 'react';
import { config } from '../config';

const { staticText } = config;

const Loading = ({ showText = true }) => (
  <div className="loading">
    <div className="loading-spinner"></div>
    {showText && <div>{staticText.loadingMessage}</div>}
  </div>
);

export default Loading;
