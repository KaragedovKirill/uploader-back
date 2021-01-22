const path = require('path');
const express = require('express');
const multer = require('multer');
const db = require('./db');

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  const files = db.get('images');
  res.json({ status: 'OK', data: files });
});

app.post('/upload', upload.single('image'), function (req, res, next) {
  const { file, body } = req;
  console.log('file', file);
  console.log('body', body);
  const image = {
    id: String(Math.random()).slice(2),
    imageUrl: `http://localhost:8080/uploads/${file.filename}`
  }
  try {
    db.get('images')
      .push(image)
      .write();
  } catch (error) {
    throw new Error(error);
  }

  res.json({ status: 'OK', data: image })
});

app.listen(8080, () => console.log('listening at 8080...'));
