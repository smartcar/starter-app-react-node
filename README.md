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

## Live or Simulated Vehicles:
This Starter App supports live vehicle connections by default. Should you prefer to test with a simulated vehicle, the auth client builder mode can be set to simulated and a simulated vehicle created. Please see our [documentation](https://smartcar.com/docs/help/vehicle-simulator) for further instructions. 

## Instructions

1. Before we get started, create an application on the [Smartcar's Developer Dashboard](https://dashboard.smartcar.com/signup) to obtain your API keys. The following keys will be required:
    - `client_id`: This key can be found in your Smartcar Developer Dashboard under the 'Configuration' tab.
    - `jsonwebtoken-key`: You can obtain a secret key using a generator like UUID or create one yourself. It should be a long and secure string, similar to a passphrase.

2. In the Configuration tab of your [Smartcar Developer Dashboard](https://dashboard.smartcar.com), set your `redirect_uri`.
  a. `redirect_uri`: As we'll be utilizing the Smartcar JS SDK and hosting the client on port 3000, the corresponding URI will be: `https://javascript-sdk.smartcar.com/v2/redirect?app_origin=http://localhost:3000`

3. Make sure you have cloned this repo and change into the server directory
```bash
$ git clone https://github.com/smartcar/starter-app-react-node.git
$ cd starter-app-react-node/server
```

4. Please follow the instructions in the server-readme to set up a Node backend with Express. You will be prompted to provide your Smartcar keys and JWT key for storing the access token in a cookie. Feel free to review and adjust the Smartcar vehicle endpoints as per your requirements...

5. Open a second terminal at the root directory of this project and change into the client directory
```bash
$ cd client
```
6. Follow the instructions in the client-readme to set up a React front end with Axios as the HTTP client. Please review how `smartcar` is instantiated in `App.jsx` and make any necessary configurations for the Connect flow to suit your specific use case.
   
7. Customize your configurations and build your app! The configuration file contains everything you need to get started. Please take a look at each of the following items:
   - `properties` contains information needed to render the components and functionalities. Each vehicle property included here is mapped to popular Smartcar endpoints. Additionally, there are many more endpoints available on our [documentation page](https://smartcar.com/docs/api-reference/management/all-vehicles)!
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
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/678747b3-d0dc-45dc-8ba6-dad27ba25eef" alt="connect page" width=300px /> | The app includes the implementation of Smartcar Connect, allowing users to authorize vehicles through the Connect flow. |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/c17decc4-4af6-46bd-b632-1c15ceba1b1f" alt="auto insurance" width=300px /> | `autoInsuranceConfig`: **Single Select** allows the user to connect one of their vehicles. Once authorized, the user can review up-to-date and accurate vehicle data, including VIN, mileage, location, engine oil, and tire pressure. |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/5da617d8-82ee-4309-9127-ac0d65ac7e7d" alt="energy utilities" width=300px /> | `energyUtilitiesConfig`: **Brand Select** (TESLA) skips the brand selection step of the Connect flow and directs the user to the Tesla login page. Once connected, the user can review various EV statistics of their Tesla vehicle, such as charge state, time to completion, battery level, battery range, charge limit, battery capacity, voltage, wattage, and amperage. The user may also perform actions such as starting and stopping charge, setting the charge limit, and setting the amperage. |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/a8f27c68-739c-4e61-a169-a8b007fe712c" alt="car share" width=300px /> | `carShareConfig`: Once authorized, the user can review the vehicle's location, odometer, and fuel tank or battery status (depending on the vehicle). Additionally, users can lock and unlock the vehicle. |
| <img src="https://github.com/smartcar/starter-app-react-node/assets/119897746/4392e843-3b5d-407a-a74c-eb98f1c02fb3" alt="roadside assistance" width=300px />___________________________________________ | `roadsideAssistanceConfig`: Retrieve up-to-date status about a vehicle's location, odometer, tire pressure, and engine oil. |

# Adding new endpoints:
This starter app includes popular Smartcar endpoints, but we're constantly working to add new ones. Here is an example of adding the `read_compass` endpoint to give you an idea for adding a simple `GET` endpoint.
1. Check the [documentation for read_compass](https://smartcar.com/docs/api-reference/tesla/get-compass-heading).
2. This endpoint has two properties: heading and direction. I only want **direction** so I'll add that as a property in config.js in the client repo. Note that this is a Tesla-specific endpoint
```
direction: {
  name: 'direction',
  permission: 'read_compass',
  supportedMakes: ['TESLA'],
  requestType: 'GET',
  componentType: 'VehicleProperty',
  text: 'Direction',
}
```
3. Now I'll include `properties.direction` to my config.
3. Looking at the payload in the documentation, I'm happy with using the returned string for direction as is "SW", so in the `staticText` object in `Properties.jsx`, I'll add
   `direction: (status) => status,` which will output the returned string in the Vehicle details page.
5. In the `vehicleProperties.js` file in the server, I'll need to add a field for direction. I can check the documentation to see how this Tesla endpoint is constructed. In debug mode, I saw that `batchResponse` now has a `teslaCompass` method which returns an object with a `direction` field, which I will return.
```
  direction: {
    endpoint: (make) => `/${make.toLowerCase()}/compass`,
    supportedMakes: ['TESLA'],
    process: (batchResponse, make) => {
      try {
        if (make === 'TESLA') {
          return batchResponse.teslaCompass().direction;
        }
        throw new Error ('Unsupported make')
      } catch (err) {
        return handleError(err);
      }
    },
  }
```
6. Test the flow with a Tesla vehicle, you should now see a Direction field displayed.

That concludes an example for adding a new GET endpoint. For adding new POST endpoints, that may involve adding a new component type in `Properties.jsx` and a new method in `api.js` on the client. On the server, a new route may be needed.

Remember to check our [documentation](https://smartcar.com/docs/api-reference/management/all-vehicles) for details on each endpoints as well staying up to date with new endpoints being released!
