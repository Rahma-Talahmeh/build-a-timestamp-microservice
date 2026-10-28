import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// enable CORS
app.use(cors({ optionsSuccessStatus: 200 }));

// static files
app.use(express.static('public'));

// routing
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

// Timestamp Microservice Endpoints (تعريف المسارين لضمان عدم حدوث خطأ في الـ Layer)
app.get("/api", function (req, res) {
  let date = new Date();
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

app.get("/api/:date", function (req, res) {
  let dateInput = req.params.date;
  let date;

  // فحص ما إذا كان المدخل عبارة عن أرقام فقط (Unix timestamp)
  if (/^\d+$/.test(dateInput)) {
    date = new Date(parseInt(dateInput));
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// listen for requests
const listener = app.listen(process.env.PORT || 8000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});