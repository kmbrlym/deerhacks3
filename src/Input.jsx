import { useState } from 'react';
import './App.css';
function Input({ label, value, onChange }) {
    const handleChange = (event) => {
      onChange(event.target.value);
    };
  
    return (
      <div className='formSubmit'>
        <label htmlFor={label.toLowerCase()}>What {label} are you planning to interview for?</label>
        <input type="text" id={label.toLowerCase()} value={value} onChange={handleChange} />
      </div>
    );
  }
  
  export default Input;
  