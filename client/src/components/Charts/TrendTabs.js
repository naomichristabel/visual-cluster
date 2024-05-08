import React, { useState } from 'react'
import TrendContainer from './TrendContainer.js';
import { LABEL } from '../../utils/Contants.js';

const TrendTabs = () => {
    const [activeTab, setActiveTab] = useState(1);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
      };

  return (
    <>
      <div className='title'>
          {activeTab === 1 && <h4>{LABEL.currentTrendTitle}</h4>}
          {activeTab === 2 && <h4>{LABEL.upcomingTrendTitle}</h4>}
      </div>

      <div className="container">
      <ul className="nav nav-pills justify-content-center mt-3">

      {/* <li className="nav-item">
          <button
            className={`nav-link btn ${activeTab === 0 ? "active" : ""}`}
            onClick={() => handleTabClick(0)}
          >
            {LABEL.trendTabs.past}
          </button>
        </li> */}

        <li className="nav-item">
          <button
            className={`nav-link btn ${activeTab === 1 ? "active" : ""}`}
            onClick={() => handleTabClick(1)}
          >
            {LABEL.trendTabs.current}
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link btn ${activeTab === 2 ? "active" : ""}`}
            onClick={() => handleTabClick(2)}
          >
            {LABEL.trendTabs.upcoming}
          </button>
        </li>
      </ul>
      </div>

      <div className="tab-content">
        {activeTab === 0 && <TrendContainer title={LABEL.trendTabs.past}/>}
        {activeTab === 1 && <TrendContainer title={LABEL.trendTabs.current}/>}
        {activeTab === 2 && <TrendContainer title={LABEL.trendTabs.upcoming}/>}
      </div>

    </>
  )
}

export default TrendTabs
