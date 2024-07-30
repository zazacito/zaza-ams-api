const express = require("express");
const functions = require("firebase-functions");
const sdk = require('api')('@catapultconnect/v6#dgos2allogj3z8');
const axios = require('axios');
const cors = require("cors"); // Import the CORS middleware
const qs = require('qs'); // Import qs for URL-encoded data

const app = express();

app.use(express.json());


app.use(cors({
  origin: ["http://localhost:5173", "https://zaza-ams.web.app"],
}));


app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Zazacito API!" });
});



async function getAuthToken(clientId, clientSecret) {
  try {
    const tokenUrl = `https://security.valdperformance.com/connect/token`;
    const data = qs.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    });
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const response = await axios.post(tokenUrl, data, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error('Error retrieving auth token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to retrieve auth token');
  }
}

// Endpoint to retrieve ForceDecks tests
const valdApiBaseUrl = "https://prd-euw-api-extforcedecks.valdperformance.com";
app.post("/vald/forcedecks/tests", async (req, res) => {
  try {
    const { clientId, clientSecret, teamUid, startDate, endDate } = req.body;

    if (!clientId || !clientSecret || !teamUid || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const token = await getAuthToken(clientId, clientSecret);

    const url = `${valdApiBaseUrl}/v2019q3/teams/${teamUid}/tests/detailed/${startDate}/${endDate}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching ForceDecks tests.", error: error.message });
  }
});

app.post("/vald/forcedecks/testDetail", async (req, res) => {
  try {
    const { clientId, clientSecret, teamUid, testId } = req.body;

    if (!clientId || !clientSecret || !teamUid || !testId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const token = await getAuthToken(clientId, clientSecret);

    const url = `${valdApiBaseUrl}/v2019q3/teams/${teamUid}/tests/${testId}/trials`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching ForceDecks test details.", error: error.message });
  }
});

app.post("/catapult/sessions", async (req, res) => {
  try {
    const { startTime, endTime, apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.getAllActivities({ start_time: startTime, end_time: endTime })

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the session raw data.", error: error });
  }
});


app.post("/catapult/sessionperioddata", async (req, res) => {
  try {
    const { sessionId, parameters, apiKey } = req.body;

    axios
      .post(`https://connect-eu.catapultsports.com/api/v6/stats`,
        {
          "group_by": ["period", "athlete"],
          "filters": [
            {
              "name": "activity_id",
              "comparison": "=",
              "values": [sessionId],
            }
          ],
          "parameters": parameters,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        })
      .then((response) => {
        res.json(response.data);
      })

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the period session data.', error: error.message });
  }
});

app.post('/catapult/sessionannotationdata', async (req, res) => {
  try {
    const { sessionId, parameters, apiKey } = req.body;

    axios
      .post(`https://connect-eu.catapultsports.com/api/v6/stats`,
        {
          "group_by": ["annotation", "athlete"],
          "filters": [
            {
              "name": "activity_id",
              "comparison": "=",
              "values": [sessionId],
            }
          ],
          "parameters": parameters,
          "source": "annotation_stats"
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        })
      .then((response) => {
        res.json(response.data);
      })

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the annotation session data.', error: error.message });
  }
});



app.post("/catapult/sessionrawdata", async (req, res) => {
  try {
    const { sessionId, athleteId, apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.get10HzDualStreamSensorDataForAthleteInActivity({
      activity_id: sessionId,
      athlete_id: athleteId,
    });

    if (data.length > 0) {
      res.json(data[0].data);
    } else {
      res.status(404).json({ error: "No session data found for the session ID and athlete ID." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the session raw data.", error: error });
  }
});

app.post("/catapult/sessioneffortsdata", async (req, res) => {
  try {
    const { sessionId, athleteId, apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.getEffortsDataForAthleteInActivity({
      effort_types: 'acceleration,velocity',
      velocity_bands: '6,7,8',
      acceleration_bands: '-3,3',
      activity_id: sessionId,
      athlete_id: athleteId,
    })

    if (data.length > 0) {
      res.json(data[0].data);
    } else {
      res.status(404).json({ error: "No session data found for the session ID and athlete ID." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the session efforts data.", error: error });
  }
});

app.post("/catapult/sessioneventsdata", async (req, res) => {
  try {
    const { sessionId, athleteId, apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.getEventsDataForAthleteInActivity({
      event_types: 'rugby_union_contact_involvement,rugby_league_tackle,rugby_union_kick',
      activity_id: sessionId,
      athlete_id: athleteId,
    })

    if (data.length > 0) {
      res.json(data[0].data);
    } else {
      res.status(404).json({ error: "No session data found for the session ID and athlete ID." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the session events data.", error: error });
  }
});


app.post("/catapult/sessionannotations", async (req, res) => {
  try {
    const { sessionId, apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.getActivityAnnotations({ id: sessionId })

    if (data.length > 0) {

      res.json(data);
    } else {
      res.status(404).json({ error: "No annotation data found for the session ID." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the session annotation data.", error: error });
  }
});

app.post("/catapult/sessionperiods", async (req, res) => {
  try {
    const { sessionId, apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.getPeriodsInActivity({ id: sessionId })

    if (data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({ error: "No periods data found for the session ID." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the session periods data.", error: error });
  }
});

app.post("/catapult/sessionDeepDetails", async (req, res) => {
  try {
    const { sessionId, apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.getDeepActivity({ include: 'all', id: sessionId })

    if (data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({ error: "No deep details found for the session ID." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the session deep details.", error: error });
  }
});

app.post("/catapult/live/athletes", async (req, res) => {
  try {
    const { apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    console.log('apiKey', apiKey)
    const { data } = await sdk.getLiveAthletes();

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the session live athletes data.", error: error });
  }
});




app.post("/catapult/live/info", async (req, res) => {
  try {
    const { apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.getLiveInfo()

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the session live info.", error: error });
  }
});

app.post("/catapult/periodeffortsdata", async (req, res) => {
  try {
    const { periodId, athleteId, apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.getEffortsDataForAthleteInPeriod({
      effort_types: 'acceleration,velocity',
      velocity_bands: '6,7,8',
      acceleration_bands: '-3,3',
      period_id: periodId,
      athlete_id: athleteId,
    })

    if (data.length > 0) {
      res.json(data[0].data);
    } else {
      res.status(404).json({ error: "No period data found for the period ID and athlete ID." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the period efforts data.", error: error });
  }
});

app.post("/catapult/periodeventsdata", async (req, res) => {
  try {
    const { periodId, athleteId, apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.getEventsDataForAthleteInPeriod({
      event_types: 'rugby_union_contact_involvement,rugby_league_tackle,rugby_union_kick',
      period_id: periodId,
      athlete_id: athleteId,
    })

    if (data.length > 0) {
      res.json(data[0].data);
    } else {
      res.status(404).json({ error: "No period data found for the period ID and athlete ID." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the period events data.", error: error });
  }
});

exports.api = functions.runWith({ timeoutSeconds: 260 }).https.onRequest(app);


