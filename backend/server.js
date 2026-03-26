const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// In-memory database (temporary storage)
let patients = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1980-01-15',
    gender: 'Male',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, City, State',
    medicalCondition: 'Hypertension',
    bloodType: 'O+',
    allergies: 'None',
    emergencyContact: 'Jane Doe - 123-456-7890',
    lastVisit: '2024-01-15'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1992-05-20',
    gender: 'Female',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    address: '456 Oak Ave, City, State',
    medicalCondition: 'Diabetes Type 2',
    bloodType: 'A+',
    allergies: 'Penicillin',
    emergencyContact: 'Bob Smith - 098-765-4321',
    lastVisit: '2024-02-20'
  }
];

let nextId = patients.length + 1;

// Routes

// GET all patients
app.get('/api/patients', (req, res) => {
  try {
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patients' });
  }
});

// GET single patient by ID
app.get('/api/patients/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const patient = patients.find(p => p.id === id);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patient' });
  }
});

// POST create new patient
app.post('/api/patients', (req, res) => {
  try {
    const newPatient = {
      id: nextId++,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    patients.push(newPatient);
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: 'Error creating patient' });
  }
});

// PUT update patient
app.put('/api/patients/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = patients.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    const updatedPatient = {
      ...patients[index],
      ...req.body,
      id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    patients[index] = updatedPatient;
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: 'Error updating patient' });
  }
});

// DELETE patient
app.delete('/api/patients/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = patients.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    patients = patients.filter(p => p.id !== id);
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting patient' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    patientsCount: patients.length
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📋 API endpoints:`);
  console.log(`   GET    /api/patients        - Get all patients`);
  console.log(`   GET    /api/patients/:id    - Get patient by ID`);
  console.log(`   POST   /api/patients        - Create new patient`);
  console.log(`   PUT    /api/patients/:id    - Update patient`);
  console.log(`   DELETE /api/patients/:id    - Delete patient`);
  console.log(`   GET    /api/health          - Health check`);
});