require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const gigsRoutes = require('./routes/gigs');
const bidsRoutes = require('./routes/bids');

const app = express();
connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://gigflow-servicehive-j8hbuiyvi-saksham-jains-projects-4a0a7f8e.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false); 
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigsRoutes);
app.use('/api/bids', bidsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
