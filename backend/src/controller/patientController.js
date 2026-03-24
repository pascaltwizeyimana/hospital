const db = require('../config/db.js');
const getAllPatients = async (req, res) => {
    try{
        let query = 'SELECT * FROM patients';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//register new patient
const createPatient = async (req, res) => {
    try {

        const { name,age,gender,ward,diagnosis} = req.body;
        const sql = "INSERT INTO patients (name,age,gender,ward,diagnosis) VALUES (?,?,?,?,?)";
        const values = [name,age,gender,ward,diagnosis];
        const[rows] = await db.query(sql,values);
        res.status(201).json({ message: 'Patient created successfully' });
        patientId:rows.insertId
    }catch(error){
        console.error('Error registring patient',error);

    }
}
// updates patient
const updatePatient = async (req, res) => {
try{
    const {id} = req.params;
    const { name,age,gender,ward,diagnosis} = req.body;
    let query = "UPDATE patients SET name = ?, age = ?, gender = ?, ward = ?, diagnosis = ? WHERE id = ?";
    await db.query(query, [name, age, gender, ward, diagnosis, id]);
    res.json({

        message: 'Patient updated successfully'
    });
}catch (error){
    console.error("Updating error",error);
    res.status(500).json({ 
        error: "Server Error"
    });
}
}
// Delete patient

const deletePatient = async (req, res) => {
try{
    const {id} = req.params;
    const query = "DELETE FROM patients WHERE id = ?";
    await db.query(query, [id]);
    res.json({
        message: 'Patient deleted successfully'
    });
} catch (error) {
        console.error('Deleting patient:', error);
        res.status(500).json({
             error: 'Internal Server Error' });
    }
}


module.exports = { getAllPatients, createPatient, updatePatient, deletePatient };
