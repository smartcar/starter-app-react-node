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
  mode: 'live', // one of ['live', 'simulated']
});

// Exchanges code for access object, attaches access object to session cookie as a JWT
app.get('/exchange', async function(req, res) {
  try {
    const code = req.query.code;
    const access = await client.exchangeCode(code)
    // For now, we'll store the access object as a jwt in a session cookie
    // In a production app, you'll want to store it in some kind of persistent storage 
    // and handle refreshing the token, which expires after 2 hrs https://smartcar.com/docs/api/#refresh-token-exchange
    const accessToken = jwt.sign(
      access,
      process.env.JWT_SECRET_KEY,
    )
    res.cookie('my-starter-app', accessToken, {
      expires: 0, // makes this a session cookie
      path: '/',
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
  
    res.status(200).json({ message: 'success' });
  } catch (err) {
    const message = err.message || 'Failed to exchange code for access token';
    res.status(500).json({error: message})
  }
});

// Gets a list of authorized vehicles and info for the first vehicle in that list
app.get('/vehicles', authenticate, async function(req, res) {
  try {
    const unitSystem = req.query.unitSystem;
    const vehicleProperties = req.query.vehicleProperties?.split('.');
    let vehicles = [];
    let selectedVehicle = {};

    const { accessToken } = req.tokens;
    const { vehicles: vehicleIds } = await smartcar.getVehicles(accessToken);
    // we'll also get all the info for the first vehicle in the list
    // TODO: use Promise.all for these two async calls
    if (vehicleIds.length > 0) {
      vehicles = await getVehiclesWithAttributes(vehicleIds, accessToken);
      selectedVehicle = await getVehicleInfo(
        vehicles[0].id,
        accessToken,
        vehicleProperties,
        unitSystem,
        vehicles[0].make
      );
    }
    res.status(200).json({
      vehicles,
      selectedVehicle,
    })
  } catch (err) {
    const message = err.message || 'Failed to fetch vehicles.';
    res.status(500).json({error: message})
  }
})

// Gets info for a single vehicle
app.get('/vehicle', authenticate, async function(req, res) {
  try {
    const vehicleProperties = req.query.vehicleProperties?.split('.');
    const { accessToken } = req.tokens;
    const { vehicleId, unitSystem, make } = req.query;

    const vehicleData = await getVehicleInfo(vehicleId, accessToken, vehicleProperties, unitSystem, make);
    console.log(vehicleData);
    res.json(vehicleData);
  } catch (err) {
    const message = err.message || 'Failed to get vehicle info.';
    res.status(500).json({error: message})
  }
});

// Stop or start charge for a vehicle
app.post('/vehicle/charge', authenticate, async function(req, res) {
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

// Set charge limit for vehicle
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
    const result = await vehicle.setChargeLimit(limit / 100);
    res.status(200).json({
      limit,
      message: result.message || 'Successfully sent request to vehicle',
    })
  } catch (err) {
    const message = err.message || 'Failed to set charge limit.';
    res.status(500).json({error: message})
  }
})

// Set amperage for vehicle
app.post('/vehicle/amperage', authenticate, async function(req, res) {
  try {
    const { accessToken } = req.tokens;
    const { vehicleId, make } = req.query;
    let { amperage } = req.body;
    if (isNaN(amperage)) {
      throw new Error('Amperage is not a number');
    }
    amperage = Number(amperage);

    const vehicle = createSmartcarVehicle(vehicleId, accessToken);
    // TODO: handle BSE
    const result = await vehicle.request("POST", `${make.toLowerCase()}/charge/ammeter`, {"amperage": amperage});
    res.status(200).json({
      amperage,
      message: result.message || 'Successfully sent request to vehicle',
    })

  } catch (err) {
    const message = err.message || 'Failed to set charge limit.';
    res.status(500).json({error: message})
  }
})

// Lock or unlock a vehicle
app.post('/vehicle/security', authenticate, async function(req, res) {
  try {
    const { action } = req.body;
    const { accessToken } = req.tokens;
    const vehicleId = req.query.vehicleId;
    const vehicle = createSmartcarVehicle(vehicleId, accessToken);
    
    let result;
    if (action === 'LOCK') {
      result = await vehicle.lock();
    } else if (action === 'UNLOCK') {
      result = await vehicle.unlock();
    } else {
      throw new Error('Missing or invalid action payload in request to lock/unlock');
    }
    res.status(200).json({
      message: result.message || "Successfully sent request to vehicle",
    });
  } catch (err) {
    const message = err.message || 'Failed to lock/unlock.';
    res.status(500).json({error: message})
  }
})

// disconnect a vehicle
app.delete('/vehicle', authenticate, async function(req, res) {
  try {
    const { accessToken } = req.tokens;
    const vehicleId = req.query.vehicleId;
    const vehicle = createSmartcarVehicle(vehicleId, accessToken);
    await vehicle.disconnect();
    res.status(200).json({
      message: "Successfully disconnected vehicle",
    });
  } catch (err) {
    const message = err.message || 'Failed to disconnect vehicle.';
    res.status(500).json({error: message})
  }
})

// disconnect all vehicles
app.delete('/vehicles', authenticate, async function(req, res) {
  try {
    const { accessToken } = req.tokens;
    const { vehicles: vehicleIds } = await smartcar.getVehicles(accessToken);
    const disconnectPromises = vehicleIds.map((vehicleId) => {
      const vehicle = createSmartcarVehicle(vehicleId, accessToken);
      return vehicle.disconnect();
    })

    const settlements = await Promise.allSettled(disconnectPromises);
    if (settlements.some(settlement => settlement.status === 'rejected')) {
      res.status(500).json({error: 'Failed to disconnect one or more vehicles'})
    } else {
      res.status(200).json({
        message: "Successfully disconnected all vehicles",
      });
    }
  } catch (err) {
    const message = err.message || 'Failed to disconnect vehicles.';
    res.status(500).json({error: message})
  }
});

/**
 * SMARTCAR WEBHOOKS
 * Before using this route, please read the Webhooks section of the readme.
 */
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
