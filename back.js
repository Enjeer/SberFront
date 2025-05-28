require('dotenv').config();
const express = require('express');
const app = express();

app.get('/api/data', async (req, res) => {
  const data = await fetch('https://external-api.com', {
    headers: { 
      Authorization: `Bearer ${process.env.API_SECRET}` // ключ только на сервере!
    }
  });
  res.json(data);
});

app.listen(3001);