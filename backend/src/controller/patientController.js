const db = require('../config/db');

// Get all patients
const getAllPatients = async (req, res) => {
    try {
        const query = 'SELECT * FROM patients ORDER BY id DESC';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get patient by ID
const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM patients WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create new patient
const createPatient = async (req, res) => {
    try {
        const { name, age, gender, ward, diagnosis } = req.body;
        
        // Validate required fields
        if (!name || !age || !gender) {
            return res.status(400).json({ 
                error: 'Name, age, and gender are required fields' 
            });
        }
        
        const sql = "INSERT INTO patients (name, age, gender, ward, diagnosis) VALUES (?, ?, ?, ?, ?)";
        const values = [name, age, gender, ward, diagnosis];
        const [result] = await db.query(sql, values);
        
        // Fetch the created patient
        const [newPatient] = await db.query('SELECT * FROM patients WHERE id = ?', [result.insertId]);
        
        res.status(201).json({ 
            message: 'Patient created successfully',
            patient: newPatient[0]
        });
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update patient
const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, gender, ward, diagnosis } = req.body;
        
        // Check if patient exists
        const [existing] = await db.query('SELECT * FROM patients WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        const query = "UPDATE patients SET name = ?, age = ?, gender = ?, ward = ?, diagnosis = ? WHERE id = ?";
        await db.query(query, [name, age, gender, ward, diagnosis, id]);
        
        // Fetch updated patient
        const [updatedPatient] = await db.query('SELECT * FROM patients WHERE id = ?', [id]);
        
        res.json({
            message: 'Patient updated successfully',
            patient: updatedPatient[0]
        });
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete patient
const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if patient exists
        const [existing] = await db.query('SELECT * FROM patients WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        const query = "DELETE FROM patients WHERE id = ?";
        await db.query(query, [id]);
        
        res.json({
            message: 'Patient deleted successfully',
            deletedId: parseInt(id)
        });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Search patients
const searchPatients = async (req, res) => {
    try {
        const { query } = req.params;
        const searchQuery = `%${query}%`;
        const sql = "SELECT * FROM patients WHERE name LIKE ? OR diagnosis LIKE ? OR ward LIKE ?";
        const [rows] = await db.query(sql, [searchQuery, searchQuery, searchQuery]);
        res.json(rows);
    } catch (error) {
        console.error('Error searching patients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get statistics
const getStatistics = async (req, res) => {
    try {
        // Total patients
        const [totalResult] = await db.query('SELECT COUNT(*) as total FROM patients');
        
        // Gender distribution
        const [genderStats] = await db.query('SELECT gender, COUNT(*) as count FROM patients GROUP BY gender');
        
        // Ward distribution
        const [wardStats] = await db.query('SELECT ward, COUNT(*) as count FROM patients GROUP BY ward');
        
        // Age statistics
        const [ageStats] = await db.query(`
            SELECT 
                MIN(age) as youngest,
                MAX(age) as oldest,
                AVG(age) as average_age
            FROM patients
        `);
        
        res.json({
            totalPatients: totalResult[0].total,
            genderDistribution: genderStats,
            wardDistribution: wardStats,
            ageStatistics: ageStats[0]
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { 
    getAllPatients, 
    getPatientById,
    createPatient, 
    updatePatient, 
    deletePatient,
    searchPatients,
    getStatistics
};