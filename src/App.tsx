import React from 'react';
import { PROJECT_URL, WEBSITE_TITLE } from './constants/general';
import { Footer } from './components/Footer';
import { MapWrapper } from './components/MapWrapper';
import './App.css';

function App() {
  return (
    <div className="App">
      <MapWrapper />
    </div>
  );
}

export default App;
