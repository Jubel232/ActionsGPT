const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

const app = express();
app.use(bodyParser.json());

// ✅ Charger les credentials depuis une variable d'environnement
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);

// Authentification Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// ✅ Ton Google Sheet ID
const SPREADSHEET_ID = '1wi2xi1umJlNUDagVG9P-8ljK75K-kAT0s13-4_cHag8';

app.post('/log', async (req, res) => {
  const { sender, message, timestamp } = req.body;

  if (!sender || !message || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Messages!A:C',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp, sender, message]],
      },
    });

    console.log(`✅ Message loggé : ${sender} - ${message}`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur Google Sheets :', error.message);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du message' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 API Logger en écoute sur http://localhost:${PORT}`);
});
