const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/user-profile-service/api', profileRoutes);

const port = process.env.PORT || 5002;

app.listen(port, () => {
  console.log(`User Profile Service running on port ${port}`);
});
