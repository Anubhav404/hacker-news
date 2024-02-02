// Login.js
import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:5000/api/login', formData);
      console.log('Login successful');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
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
      <button type="button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;
