import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Link,Routes } from 'react-router-dom';
import App from './App';
import Home from './Home';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>

          <Route path="app" element={<App/>} />
          <Route path="home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
);
