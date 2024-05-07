import React, { useState, useEffect } from 'react';
import ThreePointVis from './components/ThreePointVis/ThreePointVis.js';
import './styles.css';
import { PIPE_CONSTANTS, COLOURS } from './utils/Contants.js';
import { DataContextProvider } from './store/DataProvider.js';
import DataContext from './store/DataProvider.js';
import BarChart from './components/Charts/BarChart.js';
import HeatMap from './components/Charts/HeatMap.js';
import { Heatmap } from './components/Charts/Heatmap/Heatmap.js';
import Legend from './components/Charts/Legend.js';
import Reset from './components/ThreePointVis/Reset.js';
import TrendTabs from './components/Charts/TrendTabs.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Histogram from './components/Charts/Histogram.js';

//const data = new Array(PIPE_CONSTANTS.pipeSectionCount).fill(0).map((d, id) => ({ id: id + 1, d: Math.round(Math.random() * 1000) / 1000 }));
//const data = [{ id: 1500 }, { id: 1704 }, { id: 1620 }, { id: 1980 }, { id: 2000 }, { id: 2200 }, { id: 1840 }]

export default function App() {
  const [layout, setLayout] = useState('grid');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [loading, setLoading] = useState(true);  
  const [isReset, setIsReset] = useState(false);
  const [newPipeData, setNewPipeData] = useState();

  const visRef = React.useRef();

  const handleResetCamera = () => {
    visRef.current.resetCamera();
  };

  const handleReset = () => {
    setIsReset(true);
  };

  const handlePipeDataUpdate = (data) => {
    setNewPipeData(data)
  }

  // React.useEffect(() => {
  //   fetch("http://localhost:8000/message")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message));
  // }, []);

  return (
    <DataContextProvider>
      <div className='title'>
        <h4>Visual Cluster Analysis</h4>
      </div>
     <div className="App">
        <div className="vis-container">
          <ThreePointVis
            // data={data}
            ref={visRef}
            layout={layout}
            selectedPoint={selectedPoint}
            onSelectPoint={setSelectedPoint}
          />
        </div>
        <div onClick={handleResetCamera}>
          <Reset isReset={isReset}/>
        </div>
        <div className="controls">
          {selectedPoint && (
            <div className="selected-point">
              Pipe Section ID: <strong>{selectedPoint.pipeSectionId}</strong> <br/>
              Circumference ID: <strong>{selectedPoint.circumferenceId}</strong> <br/>
              Thickness: <strong>{selectedPoint.pipeThickness} mm</strong>
            </div>
          )}
        </div>
        <Legend onReset={handleReset} />
      </div>

      <div className='chart-container'>
        <div className="chart-section row">
            {/* <BarChart /> */}
            <div className='col-md-6 mb-3'>
              <Histogram />
            </div>
            <div className='col-md-6' > 
              {/* <Histogram /> */}
             <HeatMap onCorrelationCalc={handlePipeDataUpdate}/> 
             <Heatmap width={500} height={300} newPipeData={newPipeData}/>
            </div>
        </div>

        <div className="trend-section row">
          <div className='col'>
            <TrendTabs />
          </div>
        </div>
      </div> 
    </DataContextProvider>
  );
}
