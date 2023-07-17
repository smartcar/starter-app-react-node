# Starter app - React - Node
This starter app allows you to configure your own app using Smartcar's popular vehicle endpoints.
Your users will be able to authorize their vehicles, see details, and perform actions based on the properties you select in the config file!

## What you can expect:
- The implementation of Smartcar Connect, allowing users to authorize vehicles through the Connect flow.
- A sample application page displaying the authorized vehicles and providing users with the option to disconnect vehicles if desired.
- Four pre-made configs for four different use cases: Energy and Utilities, Auto Insurance, Car Sharing, and Roadside Assitance.

<!-- TODO: Give brief synopsis "what you can expect" for each pre-made config -->

Smartcar vehicle endpoints used:
- All vehicles
- Disconnect
- Engine Oil Life
- EV Battery Level
- EV Battery Capacity
- EV Charging Status
- EV Charge Limit
- EV Start/stop charge
- EV Charging Voltage
- EV Charging Completion
- EV Charging Amperage
- EV Charging Wattage
- Location
- Odometer
- Tire pressure
- Vehicle attributes
- VIN

For the complete list of available endpoints, please visit our documentation page: https://smartcar.com/docs/api/#get-all-vehicles

## Repos included:
- **client**: Smartcar Javascript SDK and React
- **server**: Node and Express

## Instructions

1. Before we get started, create an application on the [Smartcar's Developer Dashboard](https://dashboard.smartcar.com/signup) to obtain your API keys. The following keys will be required:
    - `client_id`: This key can be found in your Smartcar Developer Dashboard under the 'Configuration' tab.
    - `redirect_uri`: As we'll be utilizing the Smartcar JS SDK and hosting the client on port 3000, the corresponding URI will be: `https://javascript-sdk.smartcar.com/v2/redirect?app_origin=http://localhost:3000`
    - `jsonwebtoken-key`: You can obtain a secret key using a generator like UUID or create one yourself. It should be a long and secure string, similar to a passphrase.

2. In the Configuration tab of your [Smartcar Developer Dashboard](https://dashboard.smartcar.com/signup), set your `redirect_uri` with the one above.

3. Please follow the instructions in the server-readme to set up a Node backend with Express. You will be prompted to provide your Smartcar keys and JWT key for storing the access token in a cookie. Feel free to review and adjust the Smartcar vehicle endpoints as per your requirements...

4. Follow the instructions in the client-readme to set up a React front end with Axios as the HTTP client. Please review how `smartcar` is instantiated in `App.jsx` and make any necessary configurations for the Connect flow to suit your specific use case.
   
6. Customize your config and build your app! The config file has everything you need to get started, take a look at each of the following:
   - `properties` contains information needed to render the components and functionalities. Each vehicle property included here maps to popular Smartcar endpoints. There are many more on our [documentation page](https://smartcar.com/docs/api/#get-all-vehicles)!
   -  There are four pre-made configs to demonstrate Smartcar integration in four different industries: auto insurance, energy/utilities, car share, and roadside assistance. The `autoInsuranceConfig` is set as the default. Explore each of the four sample configs before making your own!

**What you can expect in the pre-made configs:** 
|  |  |
| :---: | ---- |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/5a1a4b75-2aff-4b0b-b7fb-a74016a31b0a" alt="car share" width=300px /> | The app comes with the implementation of Smartcar Connect, allowing users to authorize vehicles through the Connect flow. |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/08fd61db-5b0e-4d89-a82e-0f7fea3677a9" alt="auto insurance" width=300px /> | `autoInsuranceConfig`: **Single Select** allows users to connect one of their vehicles. Once authorized, review up-to-date, accurate vehicle data such as VIN, mileage, location, engine oil, and tire pressure. |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/8a3953ff-5197-4ed9-a531-9fb6cc80f1f5" alt="energy utilities" width=300px /> | `energyUtilitiesConfig`: **Brand Select** (TESLA) skips the brand selection step of the Connect flow and directs users to the login page for Tesla. Once connected, users can review EV statistics of their Tesla vehicle like charge state, time to completion, battery level, battery range, charge limit, battery capacity, voltage, wattage, and amperage. Users may also perform actions such as starting and stopping charge, setting the charge limit, and setting the amperage. |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/bf961e97-02aa-471e-bc8b-2ff70774b0ff" alt="car share" width=300px /> | `carShareConfig`: Once authorized, the user can review the vehicle's location, odometer, and fuel tank or battery status depending on the vehicle. Users can also lock and unlock the vehicle. |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/9b4c12d8-1b99-42f6-a6b5-259b37514dcb" alt="car share" width=300px />___________________________________________ | `roadsideAssistanceConfig`: Retrieve up-to-date status about a vehicle's location, odometer, tire pressure, and engine oil. |



