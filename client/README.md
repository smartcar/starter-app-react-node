This is a flexible React web application, customizable via the centralized configuration file `src/config.js` and uses Axios as the HTTP client.

## Instructions

By now, you should have created a Smartcar account and have obtained `client-id` and `secret`.

Set these as environment variables:
```bash
$ export REACT_APP_CLIENT_ID=<your-client-id>
$ export REACT_APP_REDIRECT_URI=https://javascript-sdk.smartcar.com/v2/redirect?app_origin=http://localhost:3000
$ export REACT_APP_SERVER=http://localhost:8000
```

To install the required dependencies and run this React app:
```bash
$ npm install
$ npm start
```

In production, replace the localhosts with the correct client and server urls.

## About the code

**Custom configuration**: The configuration file `config.js` contains application specific settings that allow for quick customizations. Includes displayed properties, UI, unit system, mode (live, test, simulated), brand select, single select. Customize one of the four prebuilt configurations or build your own from scratch!

**Components**:

- `Connect`: Main landing page UI. Renders a button that begins the Connect flow.
- `Loading`: Loading UI that renders a spinner and text customizable via `config.js`
- `Vehicle`: Renders UI for displaying and managing vehicle information. Initializes state for new vehicle properties. Includes dropdown for selecting different vehicles and fetches the corresponding vehicle data.
- `Properties`: A collection of sub-components that render various vehicle properties. Maps through properties listed in `config.js` and if applicable, renders the appropriate sub-component. Includes the following sub-components:
    - `VehicleProperty`: Read-only property with single value
    - `VehiclePropertyList`: Read-only property with multiple values
    - `SetVehicleProperty`: Input field to update a vehicle property
    - `LockUnlock`: Buttons for lock and unlock
    - `StartStopCharge`: Button to start/stop the charging process
    - `Disconnect`: Button(s) for disconnecting a vehicle or all vehicles
