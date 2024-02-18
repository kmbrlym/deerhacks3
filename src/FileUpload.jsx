import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ setShowFileUpload, number }) {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState("");
  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:5000/extract_audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data);
      setResponseData(response.data);
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  };

  console.log("responseData", responseData);

  return (
    <div>
      <form className="form-submit" onSubmit={onFormSubmit}>
        <input type="file" onChange={onFileChange} accept="video/mp4,video/quicktime" />
        <button type="submit">Upload</button>
      </form>
      {responseData && (
        <div>
          <p>Positive:</p>
          <ul>
            {responseData.split('Positive: ')[1].split('Negative:')[0].split('Negative:')[0].split('-').map((item, index) => (
              <li key={index}>{item.trim()}</li>
            ))}
          </ul>
          <p>Negative:</p>
          <ul>
            {responseData.split('Negative: ')[1].split('Your overall scores')[0].split('-').map((item, index) => (
              <li key={index}>{item.trim()}</li>
            ))}
          </ul>
          <p>Your overall scores are:</p>
          <ul>
            {responseData.split('Your overall scores are: ')[1].split('-').map((item, index) => (
              <li key={index}>{item.trim()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
