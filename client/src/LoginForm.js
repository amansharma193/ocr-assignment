import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = ({ setToken, setIsAuthenticated, isAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate("");

  useEffect(() => {
    if(isAuthenticated) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://flask-ocr-wtmw.onrender.com/login', { username, password });
      console.log("token login ", response);
      const token = response.data.token; // Replace with your token extraction logic
      setToken(token);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      navigate("/dashboard")
    } catch (error) {
      // Handle login errors
      console.error(error);
    }
  };

  return (
    <div style={{display: 'table', margin: 'auto'}}>
      <h1 style={{margin: '10px'}}>OCR Assignement</h1>
      <form onSubmit={handleLogin}>
        <input style={{margin: '10px'}} type="text" placeholder=" Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input style={{margin: '10px'}} type="password" placeholder=" Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input style={{margin: '10px'}} type='submit' />
      </form>
      <div style={{margin: '10px'}} >
        <button onClick={()=>navigate('/signup')}>Create New Account!</button>
      </div>
    </div>

  );
};

export default Login;