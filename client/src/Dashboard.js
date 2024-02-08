import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ token, setToken, setIsAuthenticated }) => {
  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [formKey, setFormKey] = useState(0);

  const handleFileInputChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleLogout = () => {
    setToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      alert('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);
    try {
      const response = await fetch('https://flask-ocr-wtmw.onrender.com/process_image', {
        method: 'POST',
        headers: {
          Authorization: token || localStorage.getItem("token"),
        },
        body: formData,
      });
      let newDoc = await response.json()
      let upArr = [...data]
      upArr.splice(0, 0, newDoc);
      setData(upArr)
      if (response.ok) {
        setResponseMessage('Image uploaded successfully.');
        setSelectedImage(null); // Reset the selected image
        setFormKey(prevKey => prevKey + 1);
      } else {
        setResponseMessage('Error uploading image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setResponseMessage('Error uploading image.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://flask-ocr-wtmw.onrender.com/get_documents', {
          headers: { Authorization: token },
        });
        setData(response.data.documents);
      } catch (error) {
        // Handle API errors gracefully
        console.error(error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div>
        <div>
        <h1>Upload Image</h1>
        <form key={formKey} onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
          />
          <button type="submit">Submit</button>
        </form>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </div>
      {data.map((item, index) => (
          <div key={index}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10%', border: 'solid 2px gray'}}>
              <img style={{ width: '20%', border: 'solid 2px black'}} src={item.image_url} alt={`Image ${index}`} />
              <p style={{padding: '5%'}}>{item.parsed_text}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Dashboard;