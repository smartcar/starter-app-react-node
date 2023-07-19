# Starter app - React - Node
This starter app enables you to configure your app using Smartcar's popular vehicle endpoints. Your users will be able to authorize their vehicles, see details, and perform actions based on the properties you select in the configuration file!

## What you can expect:
- The implementation of Smartcar Connect, allowing users to authorize vehicles through the Connect flow.
- A sample application page displaying the authorized vehicles and providing users with the option to disconnect vehicles if desired.
- Four pre-made configurations for four different use cases: Energy and Utilities, Auto Insurance, Car Sharing, and Roadside Assistance.

**Smartcar vehicle endpoints used:**
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
   
5. Customize your configurations and build your app! The configuration file contains everything you need to get started. Please take a look at each of the following items:
   - `properties` contains information needed to render the components and functionalities. Each vehicle property included here is mapped to popular Smartcar endpoints. Additionally, there are many more endpoints available on our [documentation page](https://smartcar.com/docs/api/#get-all-vehicles)!
   -  We offer four pre-made configurations to showcase Smartcar integration across four different industries: auto insurance, energy/utilities, car sharing, and roadside assistance. The default configuration is `autoInsuranceConfig`. We encourage you to explore each of these sample configurations before creating your own!

## Premade configurations
The four premade configurations are designed for each of the primary use cases supported by Smartcar:
1. **Auto Insurance**: You can leverage Smartcar vehicle endpoints to verify mileage, location, and tire/engine health.
2. **Car Sharing**: Smartcar’s vehicle endpoints for location and lock/unlock can be used to enable rental and car-sharing businesses by providing remote access to a vehicle, eliminating the need for a physical car key.
3. **Energy/Utilities**: Smartcar provides a slew of EV-specific endpoints related to charging sessions and battery life, unlocking use cases around managed charging, reducing overall gridload impact, and optimizing battery health.
4. **Roadside Assistance**: Similar to the auto insurance use case, you can leverage the API endpoints for location, tire pressure, engine oil life, as well as fuel tank/battery level to check the vehicle's health and determine if any maintenance is required.

**What you can expect in the premade configurations:** 
|  |  |
| :---: | ---- |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/5a1a4b75-2aff-4b0b-b7fb-a74016a31b0a" alt="car share" width=300px /> | The app includes the implementation of Smartcar Connect, allowing users to authorize vehicles through the Connect flow. |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/08fd61db-5b0e-4d89-a82e-0f7fea3677a9" alt="auto insurance" width=300px /> | `autoInsuranceConfig`: **Single Select** allows the user to connect one of their vehicles. Once authorized, the user can review up-to-date and accurate vehicle data, including VIN, mileage, location, engine oil, and tire pressure. |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/8a3953ff-5197-4ed9-a531-9fb6cc80f1f5" alt="energy utilities" width=300px /> | `energyUtilitiesConfig`: **Brand Select** (TESLA) skips the brand selection step of the Connect flow and directs the user to the Tesla login page. Once connected, the user can review various EV statistics of their Tesla vehicle, such as charge state, time to completion, battery level, battery range, charge limit, battery capacity, voltage, wattage, and amperage. The user may also perform actions such as starting and stopping charge, setting the charge limit, and setting the amperage. |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/bf961e97-02aa-471e-bc8b-2ff70774b0ff" alt="car share" width=300px /> | `carShareConfig`: Once authorized, the user can review the vehicle's location, odometer, and fuel tank or battery status (depending on the vehicle). Additionally, users can lock and unlock the vehicle. |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/9b4c12d8-1b99-42f6-a6b5-259b37514dcb" alt="car share" width=300px />___________________________________________ | `roadsideAssistanceConfig`: Retrieve up-to-date status about a vehicle's location, odometer, tire pressure, and engine oil. |



