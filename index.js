const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

app.post('/log', (req, res) => {
  const { sender, message, timestamp } = req.body;

  if (!sender || !message || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const logEntry = { sender, message, timestamp };
  console.log('Message reçu:', logEntry);

  // Sauvegarde locale (tu peux remplacer par base de données)
  fs.appendFileSync('messages.jsonl', JSON.stringify(logEntry) + '\n');

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Logger en écoute sur http://localhost:${PORT}`);
});
