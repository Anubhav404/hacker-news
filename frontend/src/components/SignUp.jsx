// SignUp.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import {useNavigate} from "react-router-dom";


function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
//   const navigate = useNavigation(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async () => {
    try {
      await axios.post('http://localhost:5000/api/signup', formData);
    //   history.push('/'); // Redirect to the dashboard page
      navigate("/api/")  
      console.log('Signup successful');
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <label>
        Username:
        <input type="text" name="username" onChange={handleChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" onChange={handleChange} />
      </label>
      <br />
      <button type="button" onClick={handleSignUp}>
        SignUp
      </button>
      <Link to="/login">Already have an account? Login here</Link>
    </div>
  );
}

export default SignUp;
