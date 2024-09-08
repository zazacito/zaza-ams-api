const express = require("express");
const functions = require("firebase-functions");
const cors = require("cors");

const valdRoutes = require('./routes/valdRoutes');
const catapultRoutes = require('./routes/catapultRoutes');
const aiaRoutes = require('./routes/aiaRoutes')
const helpersRoutes = require('./routes/helperRoutes')

const app = express();

app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "https://zaza-ams.web.app"],
}));

// Use the imported routes
app.use('/vald', valdRoutes);
app.use('/catapult', catapultRoutes);
app.use('/aia', aiaRoutes)
app.use("/helpers", helpersRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Zazacito API!" });
});

exports.api = functions.runWith({ timeoutSeconds: 260 }).https.onRequest(app);
