require('dotenv').config();
const express = require('express'); 
const PORT = process.env.PORT || 3000;
const patientRoutes = require('./routes/patients');

const app = express(); 
app.use(express.json()); 
app.use('/api/patients',patientRoutes);

const db = require('./config/db');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;