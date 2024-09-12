const express = require('express');
const sdk = require('api')('@catapultconnect/v6#dgos2allogj3z8');
const axios = require('axios');
const router = express.Router();

router.post("/sessions", async (req, res) => {
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


router.post("/sessions", async (req, res) => {
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


router.post("/sessionperioddata", async (req, res) => {
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

router.post('/sessionannotationdata', async (req, res) => {
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



router.post("/sessionrawdata", async (req, res) => {
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

router.post("/sessioneffortsdata", async (req, res) => {
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

router.post("/sessioneventsdata", async (req, res) => {
  try {
    const { sessionId, athleteId, apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.getEventsDataForAthleteInActivity({
      event_types: 'rugby_union_contact_involvement,rugby_league_tackle,rugby_union_kick,rugby_union_lineout,rugby_union_scrum',
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


router.post("/sessionannotations", async (req, res) => {
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

router.post("/sessionperiods", async (req, res) => {
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

router.post("/sessionDeepDetails", async (req, res) => {
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

router.post("/live/athletes", async (req, res) => {
  try {
    const { apiKey } = req.body;
    sdk.auth(apiKey);
    sdk.server("https://connect-eu.catapultsports.com/api/v6");

    const { data } = await sdk.getLiveAthletes();

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the session live athletes data.", error: error });
  }
});




router.post("/live/info", async (req, res) => {
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

router.post("/periodeffortsdata", async (req, res) => {
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

router.post("/periodeventsdata", async (req, res) => {
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


module.exports = router;


module.exports = router;
