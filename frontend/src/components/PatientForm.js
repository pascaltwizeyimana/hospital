import React, { useState } from 'react';

function PatientForm() {
  const [patient, setPatient] = useState({ name: '', age: '', gender: '', ward: '', diagnosis: '' });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Patient saved:', patient);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md0 mx-auto space-y-3 ">
       <h1 className="text-xxl font-italic  bg-blend-color-dodge bg-black-700"  >HOSPITAL MANAGEMENT SYSTEM</h1>
      <h1 className="text-xl font-bold   bg-blue-400">Patient Form</h1>
      
      
      <input name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border rounded"  required />
      <input name="age" type="number" placeholder="Age" onChange={handleChange} className="w-full p-2 border rounded" required/>
      
      <select name="gender" onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Select Gender</option>
        <option>Female</option>
        <option>Male</option>
      </select>
      
      <input name="ward" placeholder="Ward" onChange={handleChange} className="w-full p-2 border rounded" />
      <textarea name="diagnosis" placeholder="Diagnosis" onChange={handleChange} className="w-full p-2 border rounded" />
      
      <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">Save Patient</button>
      {saved && <p className="text-green-600 text-center">Saved!</p>}
    </form> 
    
    
    
    
    
  );
}

export default PatientForm;