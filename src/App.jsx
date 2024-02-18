import React from 'react';
import { BrowserRouter, Route, Link, Outlet } from 'react-router-dom';
import interviewImage from './assets/Group 18 (2).png';
import Home from './Home';
import './style.css';
export default function App() {

  return (
    <>
      <div className="grid-container">
        <div className="content-left">
          <div className="header">Confident Candidate</div>
          <div className="header-1">
            Receive <span className="style-1"><em>constructive</em></span> feedback<br /> to ace your next interview
          </div>
          <div className="header-2"><em>Transform your interview prep with the power of AI!</em></div>

          <div className="stat-1">
            <span className="style-2"><em>94%</em></span>
            <span className="style-3"><em>of job seekers want interview feedback, but only 41% receive it.<br /> (Linkedin)</em></span>
          </div>
          <div className="stat-1">
            <span className="style-2"><em>73%</em></span>
            <span className="style-3"><em>of job seekers find job hunting to be one of the most highly stressful moments in their life.<br /> (CareerBuilder)</em></span>
          </div>
          <div>
            <Link to="home">GET STARTED</Link>
          </div>
        </div>
        <div className="content-right">
          <img src={interviewImage} alt="Interview Prep" />
        </div>
      </div>

      <Outlet />
    </>
  );
}


