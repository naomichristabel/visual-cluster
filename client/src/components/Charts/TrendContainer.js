import React, { useState } from 'react'
import TrendChart from './TrendChart';

const CURRENT = "Current";
const UPCOMING = "Upcoming";

const TrendContainer = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
      };

  return (
    <>
      <div className='title'>
          <h4>Trend Analysis</h4>
      </div>

      <div className="container">
      <ul className="nav nav-pills justify-content-center mt-3">
        <li className="nav-item">
          <button
            className={`nav-link btn ${activeTab === 0 ? "active" : ""}`}
            onClick={() => handleTabClick(0)}
          >
            {CURRENT}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn ${activeTab === 1 ? "active" : ""}`}
            onClick={() => handleTabClick(1)}
          >
            {UPCOMING}
          </button>
        </li>
      </ul>
      </div>

      <div className="tab-content">
        {activeTab === 0 && <TrendChart title={CURRENT}/>}
        {activeTab === 1 && <TrendChart title={UPCOMING}/>}
      </div>

    </>
  )
}

export default TrendContainer
