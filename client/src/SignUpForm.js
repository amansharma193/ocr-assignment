import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({isAuthenticated}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated) {
      navigate("/dashboard");
    }
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if(password == password2) {
        await axios.post('https://flask-ocr-wtmw.onrender.com/register', { username, email, password });
        navigate("/login")
      } else alert("password aren't matching. Please try again")
      // Optionally redirect to login page after successful signup
    } catch (error) {
      // Handle signup errors
      console.error(error);
      alert("got error ", error)
    }
  };
  return (
    <div style={{display: 'table', margin: 'auto'}}>
      <h1 style={{margin: '10px'}}>OCR Assignement</h1>
      <form onSubmit={handleSignup}>
        <input style={{margin: '10px'}} type="text" placeholder=" Enter Username"  value={username} onChange={(e) => setUsername(e.target.value)} />
        <input style={{margin: '10px'}} type="email" placeholder=" Enter Email"  value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={{margin: '10px'}} type="password" placeholder=" Enter Password"  value={password} onChange={(e) => setPassword(e.target.value)} />
        <input style={{margin: '10px'}} type="password" placeholder=" Confirm Password"  value={password2} onChange={(e) => setPassword2(e.target.value)} />
        <button style={{margin: '10px'}} type="submit">Signup</button>
      </form>
      <div style={{margin: '10px'}} >
        <button onClick={()=>navigate('/login')}>Already have an Account!</button>
      </div>
    </div>
  );
};

export default Signup;

