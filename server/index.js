'use strict';

const cors = require('cors');
const express = require('express');
const smartcar = require('smartcar');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {
  createSmartcarVehicle,
  getVehicleInfo,
  getVehiclesWithAttributes,
  handleSettlement,
} = require('./utils');
const { authenticate } = require('./middleware');

const corsOptions = {
  // TODO: specify production origin
  origin: [new RegExp("^http://localhost(:[0-9]+)?")],
  credentials: true,
  methods: ['POST', 'DELETE', 'GET', 'OPTIONS'],
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express()
  .use(cors(corsOptions))
  .use(express.json())
  .use(cookieParser());
const port = 8000;

const client = new smartcar.AuthClient({
  clientId: process.env.SMARTCAR_CLIENT_ID,
  clientSecret: process.env.SMARTCAR_CLIENT_SECRET,
  redirectUri: process.env.SMARTCAR_REDIRECT_URI,
  mode: 'live', // one of ['live', 'test', 'simulated']
});

app.get('/exchange', async function(req, res) {
  try {
    const code = req.query.code;
    const access = await client.exchangeCode(code)
    // we'll store the access object as a jwt in a session cookie
    // in a production app you'll want to store it in some kind of persistent storage 
    // and handle refreshing the token, which expires in 2 hrs https://smartcar.com/docs/api/#refresh-token-exchange
    const accessToken = jwt.sign(
      access,
      process.env.JWT_SECRET_KEY,
    )
    res.cookie('chargeUp', accessToken, {
      expires: 0, // makes this a session cookie
      path: '/',
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
  
    res.status(200).json({ message: 'success' });
  } catch (err) {
    const message = err.message || 'Failed to exchange code for access token';
    // client is not receiving this custom error message for some reason
    res.status(500).json({error: message})
  }
});

app.get('/vehicles', authenticate, async function(req, res) {
  try {
    let vehicles = [];
    let selectedVehicle = {};
    // in the event some vehicles fail to disconnect, we'll return those vehicles along with this error message
    const error = req.query.error === 'disconnection-failure' ? 'Some vehicles failed to disconnect' : undefined;
    const { accessToken } = req.tokens;
    // get list of vehicle ids
    const { vehicles: vehicleIds } = await smartcar.getVehicles(accessToken);
    // we'll also get all the info for the first vehicle in the list
    // TODO: use Promise.all for these two async calls
    if (vehicleIds.length > 0) {
      vehicles = await getVehiclesWithAttributes(vehicleIds, accessToken);
      selectedVehicle = await getVehicleInfo(vehicles[0].id, accessToken);
    }
    res.status(200).json({
      vehicles,
      selectedVehicle,
      error,
    })
  } catch (err) {
    const message = err.message || 'Failed to fetch vehicles.';
    res.status(500).json({error: message})
  }
})

app.get('/vehicle', authenticate, async function(req, res) {
  try {
    const { accessToken } = req.tokens;
    const vehicleId = req.query.vehicleId;
    const vehicleData = await getVehicleInfo(vehicleId, accessToken);
    console.log(vehicleData);
    res.json(vehicleData);
  } catch (err) {
    const message = err.message || 'Failed to get vehicle info.';
    res.status(500).json({error: message})
  }
});

app.post('/vehicle/charge', authenticate, async function(req, res) {
  // TODO: Decide how we want to update the client's chargeState, either passing it in the payload, or wait for event-based webhook
  try {
    const { action } = req.body;
    const { accessToken } = req.tokens;
    const vehicleId = req.query.vehicleId;
    const vehicle = createSmartcarVehicle(vehicleId, accessToken);
    let result;
    if (action === 'START') {
      result = await vehicle.startCharge();
    } else if (action === 'STOP') {
      result = await vehicle.stopCharge();
    } else {
      throw new Error('Missing or invalid action payload in request to control charge');
    }
    const [charge] = await Promise.allSettled([vehicle.charge()]);
    res.status(200).json({
      message: result.message || "Successfully sent request to vehicle",
      chargeState: handleSettlement(charge, 'state'),
    });
  } catch (err) {
    const message = err.message || 'Failed to start or stop charge on vehicle.';
    res.status(500).json({error: message})
  }
})

app.post('/vehicle/charge-limit', authenticate, async function(req, res) {
  try {
    let { limit } = req.body;
    if (isNaN(limit)) {
      throw new Error('Charge limit is not a number');
    }
    limit = Number(limit);

    const { accessToken } = req.tokens;
    const vehicleId = req.query.vehicleId;
    const vehicle = createSmartcarVehicle(vehicleId, accessToken);
    const result = await vehicle.setChargeLimit(limit);
    res.status(200).json({
      limit,
      message: result.message || 'Successfully sent request to vehicle',
    })
  } catch (err) {
    const message = err.message || 'Failed to set charge limit.';
    res.status(500).json({error: message})
  }
})

app.post('/vehicle/amperage', authenticate, async function(req, res) {
  try {
    let { amperage } = req.body;
    if (isNaN(amperage)) {
      throw new Error('Amperage is not a number');
    }
    amperage = Number(amperage);
    const { accessToken } = req.tokens;
    const vehicleId = req.query.vehicleId;
    const vehicle = createSmartcarVehicle(vehicleId, accessToken);
    const result = await vehicle.request("POST", "tesla/charge/ammeter", {"amperage": amperage});
    res.status(200).json({
      amperage,
      message: result.message || 'Successfully sent request to vehicle',
    })

  } catch (err) {
    const message = err.message || 'Failed to set charge limit.';
    res.status(500).json({error: message})
  }
})

app.delete('/vehicle', authenticate, async function(req, res) {
  try {
    const { accessToken } = req.tokens;
    const vehicleId = req.query.vehicleId;
    const vehicle = createSmartcarVehicle(vehicleId, accessToken);
    await vehicle.disconnect();
    res.redirect(303, '/vehicles');
  } catch (err) {
    const message = err.message || 'Failed to disconnect vehicle.';
    res.status(500).json({error: message})
  }
})

app.delete('/vehicles', authenticate, async function(req, res) {
  try {
    const { accessToken } = req.tokens;
    const { vehicles: vehicleIds } = await smartcar.getVehicles(accessToken);
    const disconnectPromises = vehicleIds.map((vehicleId) => {
      const vehicle = createSmartcarVehicle(vehicleId, accessToken);
      return vehicle.disconnect();
    })

    const settlements = await Promise.allSettled(disconnectPromises);
    // if some vehicles could not disconnect successfully, we'll send an error message along with the vehicles that are still connected
    let redirectPath = '/vehicles'; 
    if (settlements.some(settlement => settlement.status === 'rejected')) {
      redirectPath += '?error=disconnection-failure';
    }
    res.redirect(303, redirectPath);
  } catch (err) {
    const message = err.message || 'Failed to disconnect all vehicles.';
    res.status(500).json({error: message})
  }
});

// To use this route, please first read the Webhooks section of the readme
app.post('/smartcar-webhook', async function(req, res) {
  const { eventName } = req.body;
  const mat = process.env.SMARTCAR_MAT;
  // One time verification step every time a new webhook is added
  if (eventName === 'verify') {
    const challengeString = req.body.payload.challenge;
    const hmac = smartcar.hashChallenge(mat, challengeString);
    res.status(200).json({
      challenge: hmac,
    })
  } 

  // Verification step to prevent events not originating from Smartcar
  const signature = req.headers['sc-signature'];
  if (!smartcar.verifyPayload(mat, signature, req.body)) {
    // prevent further execution of this request
    return res.status(500).json({
      error: "Invalid credentials",
    })
  }

  if (eventName === 'schedule') {
    const { vehicles } = req.body.payload;
    console.log(vehicles);
    // do something with the received scheduled webhooks events

    // Smartcar expects a 2xx confirmation response
    res.status(200).json({ success: true });
  } else if (eventName === 'eventBased') {
    const { vehicles } = req.body.payload;
    console.log(vehicles);
    // do something with the received event-based webhooks events

    // Smartcar expects a 2xx confirmation response
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ error: 'Unknown event type'})
  }
})

app.listen(port, () => console.log(`Listening on port ${port}`));
