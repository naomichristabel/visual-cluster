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
import IconsContainer from './components/ThreePointVis/IconsContainer.js';
import zIndex from '@mui/material/styles/zIndex.js';

//const data = new Array(PIPE_CONSTANTS.pipeSectionCount).fill(0).map((d, id) => ({ id: id + 1, d: Math.round(Math.random() * 1000) / 1000 }));
//const data = [{ id: 1500 }, { id: 1704 }, { id: 1620 }, { id: 1980 }, { id: 2000 }, { id: 2200 }, { id: 1840 }]

export default function Home() {
  const [layout, setLayout] = useState('grid');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [loading, setLoading] = useState(true);  
  const [isReset, setIsReset] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  const [newPipeData, setNewPipeData] = useState();

  const visRef = React.useRef();

  const handleResetCamera = (flag) => {
    console.log('reseting')
    setIsReset(flag);
    visRef.current.resetCamera();
  };

  const handleToggleCheckbox = (flag) => {
    console.log('show or hide', flag)
    setShowCheckboxes(flag)
  }

  const handlePipeDataUpdate = (data) => {
    setNewPipeData(data)
  }

  const handleGenerateWorkOrder = () => {
    window.open('/work_order', '_blank')
  }

  useEffect(() => {console.log('sel point', selectedPoint)}, [selectedPoint])

  // React.useEffect(() => {
  //   fetch("http://localhost:8000/message")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message));
  // }, []);

  return (
    <>
    <DataContextProvider>
      <div className='row' style={{ backgroundColor: '#FFF'}}>
        <div className='title col-md-12 ml-5'>
          <h4>Overview Dashboard</h4>
        </div>
        <div className='row'>
          <div className='col-md-12 m-3'>
            <div className='card'>
              <div className='title'>
                <h5>Visual Cluster Analysis</h5>
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
        {/* <div onClick={handleResetCamera}>
          <Reset isReset={isReset}/>
        </div> */}
        {selectedPoint && 
          <div className="controls">
              Pipe Section ID: <strong>{selectedPoint.pipeSectionId}</strong> <br/>
              Circumference ID: <strong>{selectedPoint.circumferenceId}</strong> <br/>
              Thickness: <strong>{selectedPoint.pipeThickness} mm</strong>
          </div>
        }
        
        {showCheckboxes && <Legend isReset={isReset} onReset={handleResetCamera} />}
 
        <IconsContainer isReset={isReset} onReset={handleResetCamera} toggleCheckboxesHandler={handleToggleCheckbox}/>
              </div>
            </div>
          </div>
        </div>

 

      <div className='chart-container ms-5'>
        <div className="row ">
            {/* <BarChart /> */}
            <div className='col-md-6 chart-section'>
              <Histogram />
            </div>
            <div className='col-md-6 chart-section' > 
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
 
        <div className="trend-section row justify-content-center">
          <div className="col-md-6 d-flex justify-content-center">
            <button type="button" className="btn btn-primary" onClick={handleGenerateWorkOrder}>GENERATE WORK ORDER</button>
          </div>
        </div>
      </div> 
      </div>
    </DataContextProvider>
    </>
  );
}
