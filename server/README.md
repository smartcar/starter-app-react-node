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

To install the required dependencies and run this Node app -
```bash
$ npm install
$ npm start
```

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

# Additional Resources
[Integration-guide: add webhook notifications](https://smartcar.com/docs/integration-guide/plan-your-integration/add-webhook-notifications/#1-types-of-webhooks)

[Blog: How to use scheduled webhooks](https://smartcar.com/blog/how-to-use-scheduled-webhooks/)

[To subscribe/unsubscribe vehicles to a webhook](https://smartcar.com/docs/api/?version=v2.0&language=Node#post-subscribe)