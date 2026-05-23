const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/mess', require('./routes/messRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
