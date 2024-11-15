const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth-service/api', authRoutes);

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Auth Service running on port ${port}`);
});
