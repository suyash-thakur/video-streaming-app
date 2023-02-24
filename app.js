const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const filePath = path.join(__dirname, 'video.mp4');

app.use(cors());
app.use(express.static(path.join(__dirname, '.')));

app.get('/ping', (req, res) => res.send('pong !!'));

app.get('/video', (req, res) => {
  try {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const headers = {
        'Content-Type': 'video/mp4',
        'Content-Length': chunkSize,
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
      };
      res.status(206).set(headers);
      file.pipe(res);
    } else {
      const headers = {
        'Content-Type': 'video/mp4',
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
      };
      res.status(200).set(headers);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

module.exports = app;
