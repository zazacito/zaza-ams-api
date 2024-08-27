const express = require('express');
const axios = require('axios');
const router = express.Router();

const aiaApiBaseUrl = "https://aiamgmt.azure-api.net/aiacode-client";

// Route to fetch the list of competitions
router.post("/competitions/list", async (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const url = `${aiaApiBaseUrl}/competition/list?cd_status=1&is_amateur=false`;

    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the Competition List.", error: error.message });
  }
});

// Route to fetch competition details
router.post("/competitions/details", async (req, res) => {
  try {
    const { apiKey, competitionId } = req.body;

    if (!apiKey || !competitionId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const url = `${aiaApiBaseUrl}/competition/detail_by_id?id=${competitionId}`;

    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the Competition Details.", error: error.message });
  }
});

// Route to fetch the seasons of a specific competition
router.post("/competitions/seasons", async (req, res) => {
  try {
    const { apiKey, competitionName } = req.body;

    if (!apiKey || !competitionName) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const url = `${aiaApiBaseUrl}/competition/seasons?competition_name=${competitionName}`;

    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the Competition Seasons.", error: error.message });
  }
});

// Route to fetch the rounds of a specific competition
router.post("/competitions/rounds", async (req, res) => {
  try {
    const { apiKey, competitionId } = req.body;

    if (!apiKey || !competitionId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const url = `${aiaApiBaseUrl}/competition/agenda?id_competition=${competitionId}`;

    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the Competition Rounds.", error: error.message });
  }
});

// Route to fetch the pools of a specific competition season
router.post("/competitions/pools", async (req, res) => {
  try {
    const { apiKey, competitionId, seasonId } = req.body;

    if (!apiKey || !competitionId || !seasonId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const url = `${aiaApiBaseUrl}/competitions/${competitionId}/seasons/${seasonId}/pools`;

    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the Competition Pools.", error: error.message });
  }
});

// Route to fetch the stages of a specific competition season
router.post("/competitions/stages", async (req, res) => {
  try {
    const { apiKey, competitionId, seasonId } = req.body;

    if (!apiKey || !competitionId || !seasonId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const url = `${aiaApiBaseUrl}/competitions/${competitionId}/seasons/${seasonId}/stages`;

    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the Competition Stages.", error: error.message });
  }
});

// Route to fetch the current season of a specific competition
router.post("/competitions/currentSeason", async (req, res) => {
  try {
    const { apiKey, competitionName } = req.body;

    if (!apiKey || !competitionName) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const url = `${aiaApiBaseUrl}/competition/current_season?competition=${competitionName}`;

    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the Current Season.", error: error.message });
  }
});

// Route to fetch rankings for a specific competition and season
router.post("/competitions/rankings", async (req, res) => {
  try {
    const { apiKey, competitionId, seasonId, startRound, endRound, poolId } = req.body;

    if (!apiKey || !competitionId || !seasonId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    let url = `${aiaApiBaseUrl}/rankings/competitions/${competitionId}/seasons/${seasonId}`;

    if (startRound && startRound !== "" && endRound && endRound !== "") {
      url += `?start_round=${startRound}&end_round=${endRound}`;
      if (poolId && poolId !== "all") {
        url += `&id_pool=${poolId}`;
      }
    } else if (poolId && poolId !== "all") {
      url += `?id_pool=${poolId}`;
    }

    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the Competition Rankings.", error: error.message });
  }
});

// Route to fetch the home/away rankings for a specific competition and season
router.post("/competitions/homeAwayRankings", async (req, res) => {
  try {
    const { apiKey, competitionId, seasonId, startRound, endRound, poolId, homeAway } = req.body;

    if (!apiKey || !competitionId || !seasonId || !homeAway || !poolId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    let url = `${aiaApiBaseUrl}/rankings/competitions/${competitionId}/seasons/${seasonId}/home_away?home_away=${homeAway}`;

    if (startRound !== "" && endRound !== "") {
      url += `&start_round=${startRound}&end_round=${endRound}`;

    }
    if (poolId !== "all") {
      url += `&id_pool=${poolId}`;
    }

    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the Home/Away Rankings.", error: error });
  }
});

// Route to fetch the britanic rankings for a specific competition and season
router.post("/competitions/britanicRanking", async (req, res) => {
  try {
    const { apiKey, competitionId, seasonId, startRound, endRound, poolId } = req.body;

    if (!apiKey || !competitionId || !seasonId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    let url = `${aiaApiBaseUrl}/rankings/competitions/${competitionId}/seasons/${seasonId}/brit_ranking`;
    if (startRound && startRound !== "" && endRound && endRound !== "") {
      url += `?start_round=${startRound}&end_round=${endRound}`;
      if (poolId && poolId !== "all") {
        url += `&id_pool=${poolId}`;
      }
    } else if (poolId && poolId !== "all") {
      url += `?id_pool=${poolId}`;
    }


    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the Britanic Rankings.", error: error.message });
  }
});

// Route to fetch matches for a specific competition and season
router.post("/competitions/matches", async (req, res) => {
  try {
    const { apiKey, competitionId, seasonId, poolId } = req.body;

    if (!apiKey || !competitionId || !seasonId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    let url = `${aiaApiBaseUrl}/matches?id_competition=${competitionId}&id_season=${seasonId}&is_amateur=false&order_by=ASC`;
    if (poolId && poolId !== "all") {
      url += `&id_pool=${poolId}`;
    }

    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the Matches.", error: error.message });
  }
});

// Route to fetch an aggregated report for a specific competition and season
router.post("/competitions/aggregatedReport", async (req, res) => {
  try {
    const { apiKey, competitionId, seasonId, startRound, endRound, stageId, poolId } = req.body;

    if (!apiKey || !competitionId || !seasonId || !startRound || !endRound) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    let basicRoute = "jsonMatchesAggregate";
    if ([38, 51, 52].includes(competitionId)) {
      basicRoute = "jsonMatchesAggregate/seven";
    }
    if ([36, 40, 42].includes(competitionId)) {
      basicRoute = "jsonMatchesAggregate/collective";
    }

    let url = `${aiaApiBaseUrl}/internal/${basicRoute}?id_competition=${competitionId}&id_season=${seasonId}&start_round=${startRound}&end_round=${endRound}`;
    if ([38, 51, 52].includes(competitionId) && stageId !== "all") {
      url += `&id_stage=${stageId}`;
    }
    if (poolId && poolId !== "all") {
      url += `&id_pool=${poolId}`;
    }

    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the Aggregated Report.", error: error.message });
  }
});


// Route to fetch the team details
router.post("/teams/details", async (req, res) => {
  try {
    const { apiKey, teamId } = req.body;

    if (!apiKey || !teamId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const url = `${aiaApiBaseUrl}/teams/${teamId}`;

    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the team details.", error: error.message });
  }
});

// Route to fetch the team matches
router.post("/teams/matches", async (req, res) => {
  try {
    const { apiKey, teamId } = req.body;

    if (!apiKey || !teamId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const url = `${aiaApiBaseUrl}/matches?id_team=${teamId}&order_by=DESC`;

    const response = await axios.get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the team matches.", error: error.message });
  }
});

module.exports = router;
