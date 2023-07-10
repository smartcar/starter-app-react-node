# Energy/Utility starter app
This starter app allows users to authorize and review the battery and charging status of their Tesla vehicles.

## What you can expect:
- A Connect view that allows users to authorize their Tesla vehicle(s) through the Connect flow
- A Vehicle view displaying the authorized vehicle's battery and charging status. Users will be able to start/stop charge, set charge limit, and set amperage for their vehicle.

<!-- TODO: Add screenshots -->

Smartcar vehicle endpoints used:
- All vehicles
- Disconnect
- VIN
- EV Battery Level
- EV Battery Capacity
- EV Charging Status
- EV Charge Limit
- EV Start/stop charge
- EV Charging Voltage (BSE)
- EV Charging Completion (BSE)
- EV Charging Amperage (BSE)
- EV Charging Wattage (BSE)

BSE: Brand specific endpoints. In this case, all four BSEs above support Tesla.

For the full list of endpoints, visit our docs: https://smartcar.com/docs/api/#get-all-vehicles

## Repos included:
- **client**: Smartcar Javascript SDK and React
- **server**: Node and Express

## Instructions

1. Before we get started, create an application on Smartcar's Developer Dashboard to get your API keys. You'll need the following keys:
    - `client_id`: found in your Smartcard Developer Dashboard
    - `redirect_uri`: Since we'll be using the Smartcar JS SDK and the client will be hosted on port 3000, this URI will be `https://javascript-sdk.smartcar.com/v2/redirect?app_origin=http://localhost:3000`
    - `jsonwebtoken-key`: A secret key you can obtain by a generator like uuid or create one yourself, it should be a long and secure string like a passphrase 

2. In the Configuration tab of your Smartcar Developer Dashboard, set your `redirect_uri` with the one above.

3. Follow directions in the **server-readme**:
You'll be setting up a Node backend with Express. You'll be asked provide your Smartcar keys and JWT key for storing the access token in a cookie. You can review and adjust the Smartcar vehicle endpoints as needed. 

4. Follow directions in the **client-readme**:
You'll be setting up a React front end with Axios as the HTTP client. You may want to review how `smartcar` is instantiated in `App.jsx` and adjust any configurations for the Connect flow to fit your use case.
