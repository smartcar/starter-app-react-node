This is the Node server with Express. We'll use JWT to sign and verify the access token needed to make calls to the Smartcar api.

## Instructions

By now, you should have created a Smartcar account and have obtained `client-id` and `secret`.

Set these as environment variables:
```bash
$ export SMARTCAR_CLIENT_ID=<your-client-id>
$ export SMARTCAR_CLIENT_SECRET=<your-client-secret>
$ export SMARTCAR_REDIRECT_URI=https://javascript-sdk.smartcar.com/v2/redirect?app_origin=http://localhost:3000
$ export JWT_SECRET_KEY=<your-jsonwebtoken-key>
```

In production, replace the localhosts with the correct client and server urls.

To install the required dependencies and run this Node app in development
```bash
$ npm install
$ npm run debug
```

## About the code
**Access tokens:**
- Currently, the server receives the authorization code from the client and exchanges it for an `access` object, which contains the `accessToken` needed to make vehicle requests. The server attaches this `access` object to a session cookie, which will be extracted in subsequent requests from the client. In production, you may want to store this access object in a persistent storage and consider handling refreshing the token, which expires after 2 hours.

**Routes:**
- `GET /exchange:` exchanges code for access token after the user grants access in the Connect flow
- `GET /vehicles:` returns a list of granted vehicle along with basic info (MMY) to render these vehicles in the select menu. Also returns requested information for the first vehicle in the list to be displayed on the Vehicle screen
- `GET /vehicle:` returns requested vehicle properties for one vehicle. It uses the `getVehicleInfo` function  and the `vehicleProperties` object in utils to handle finding the correct Smartcar endpoint for each requested vehicle property, batching up the requests, and resolving the response.
- `POST /vehicle/charge`: Start and stop charge for vehicles with a battery and charging capabilities
- `POST /vehicle/charge-limit`: Set the charge limit configuration for the vehicle
- `POST /vehicle/amperage`: Set the amperage drawn by the vehicle from the EVSE for the current charging session. Currently only supports TESLA. The MAKE is required in the request in order to construct the correct endpoint — in this case, a Tesla-specific endpoint
- `POST /vehicle/security`: Lock and unlock the car.
- `DELETE /vehicle` and `DELETE /vehicles`: disconnect vehicle(s)
- `POST /smartcar-webhook`:  Listens for webhook events from Smartcar. Follow directions in webhook section below to get started. Once you’ve tested receiving the payload, choose between **scheduled** and **event-based** webhooks for your use case.

**Vehicle Properties:**
- the `vehicleProperties` object in utils corresponds to `properties` in client’s config, except it contains only read properties like attributes, batteryLevel, and fuel. Each property contains an `endpoint` used to generate a batch request and a `process` function used to extract the needed information from the resulting `batchResponse`. A batch request is recommended because it is optimized to reduce load on the vehicle’s battery.
- We’re constantly adding new endpoints that may not be included in this repo. Try adding those new endpoints to this `vehicleProperties` object

**Making requests to Smartcar:**
The server uses Smartcar’s Node SDK to instantiate a Smartcar vehicle which has methods like `vehicle.charge()` and `vehicle.batch(endpoints)`. To create requests to endpoints not included in this repo, start with the `createSmartcarVehicle` util function to create a `vehicle` instance then refer to our [Node SDK docs](https://github.com/smartcar/node-sdk/blob/master/doc/readme.md#Vehicle) and [api reference](https://smartcar.com/docs/api/#get-all-vehicles) for a full list of supported endpoints.

## Using Webhooks
To implement webhooks, follow these steps:
1. In your Smartcar dashboard, in your App's Configuration tab, retrieve the MANAGEMENT API TOKEN, export it as an env variable.
```bash
$ export SMARTCAR_MAT=<your-management-api-token>
``` 
2. In the Webhooks tab of your dashboard, create a new webhook. When asked for the callback uri, provide your server's production url + `/smartcar-webhook`. For example, `https://example.com/smartcar-webhook`. This route has been set up to listen for webhook events.
3. Next, you'll be asked to verify the webhook. Click verify. This route will return the `challenge` response as part of this verification step.
4. Send a test event. You should be able to receive the payload at the `/smartcar-webhook` route.
5. To subscribe vehicles to a webhook, instantiate a Smartcar vehicle instance. Retrieve the webhook id of the validated webhook. Then:
  - `vehicle.subscribe("{webhookId}");`
  - `vehicle.unsubscribe("{managementApiToken}", "{webhookId}");`

**Additional Resources**:

[Integration-guide: add webhook notifications](https://smartcar.com/docs/integration-guide/plan-your-integration/add-webhook-notifications/#1-types-of-webhooks)

[Blog: How to use scheduled webhooks](https://smartcar.com/blog/how-to-use-scheduled-webhooks/)

[To subscribe/unsubscribe vehicles to a webhook](https://smartcar.com/docs/api/?version=v2.0&language=Node#post-subscribe)
