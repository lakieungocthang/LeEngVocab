const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const vocabularyRoutes = require('./routes/vocabularyRoutes');

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/vocabulary-service/api', vocabularyRoutes);

const port = process.env.PORT || 5003;

app.listen(port, () => {
  console.log(`Vocabulary Service running on port ${port}`);
});
