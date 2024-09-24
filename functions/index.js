const express = require("express");
const functions = require("firebase-functions");
const cors = require("cors");
const nodemailer = require("nodemailer");


const valdRoutes = require('./routes/valdRoutes');
const catapultRoutes = require('./routes/catapultRoutes');
const aiaRoutes = require('./routes/aiaRoutes')
const helpersRoutes = require('./routes/helperRoutes')
const mailerRoutes = require('./routes/mailer');

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
app.use("/mailer", mailerRoutes);



app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Zazacito API!" });
});


// Configure Nodemailer for Yahoo
var transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: 'victor.azalbert@yahoo.fr', // Replace with your email
    pass: 'tztcwchyqqedtmot' // Replace with your email password
  }
});

exports.sendEmailOnObservationCreate = functions.firestore
  .document('observations/{docId}')
  .onCreate(async (snap, context) => {
    const newObservation = snap.data();

    // Define the recipients, subject, and content of the email
    const recipients = ['prosportconcept@gmail.com', 'victor.azalbert@yahoo.fr', 'sebastien.louisp@outlook.fr', 'jeanfredericdubois40@gmail.com', 'pierre@sportim.fr', 'l.sempe64@gmail.com', 'remycasa@hotmail.com', 'sequegermain@gmail.com', 'benjaminpecastaing@yahoo.fr', 'puyobrauclaude@gmail.com']; // Add multiple recipients here
    const subject = `Nouvelle Observation Créé Au Sujet De: ${newObservation.athleteName || 'Untitled'} ${newObservation.athleteSurname || 'Untitled'}`;

    const content = `
      <h2>Nouvelle Observation Créée <strong>Au Sujet De :</strong> ${newObservation.athleteName || 'Untitled'} ${newObservation.athleteSurname || 'Untitled'}</h2>
      <p><strong>Observation : ${newObservation.observation || 'No observation provided'} </strong></p>
      <p><strong>Créé par :</strong> ${newObservation.createdBy.userName || 'Unknown'} ${newObservation.createdBy.userSurname || 'Unknown'}</p>
      <p><strong>Date de Création :</strong> ${new Date().toLocaleString('fr-FR')}</p>
    `;

    // Setup email options
    var mailOptions = {
      from: 'victor.azalbert@yahoo.fr', // Replace with your email
      to: recipients.join(', '), // Join the array into a comma-separated string
      subject: subject,
      text: content.replace(/<[^>]+>/g, ''), // Fallback plain text version by stripping HTML tags
      html: content // HTML version of the email
    };

    // Send the email
    try {
      let info = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });

exports.api = functions.runWith({ timeoutSeconds: 260 }).https.onRequest(app);
