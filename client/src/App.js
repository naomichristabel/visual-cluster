import React, { useState } from 'react';
import ThreePointVis from './components/ThreePointVis/ThreePointVis';
import './styles.css';
import { PIPE_CONSTANTS } from './utils/Contants';
import { DataContextProvider } from './store/DataProvider';
import DataContext from './store/DataProvider';
import BarChart from './components/Charts/BarChart';
import Legend from './components/Charts/Legend';
import Reset from './components/ThreePointVis/Reset';

//const data = new Array(PIPE_CONSTANTS.pipeSectionCount).fill(0).map((d, id) => ({ id: id + 1, d: Math.round(Math.random() * 1000) / 1000 }));
//const data = [{ id: 1500 }, { id: 1704 }, { id: 1620 }, { id: 1980 }, { id: 2000 }, { id: 2200 }, { id: 1840 }]

export default function App() {
  const [layout, setLayout] = useState('grid');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [loading, setLoading] = useState(true);  
  const [isReset, setIsReset] = useState(false);

  const visRef = React.useRef();

  const handleResetCamera = () => {
    visRef.current.resetCamera();
  };

  const handleReset = () => {
    setIsReset(true);
  };

  // React.useEffect(() => {
  //   fetch("http://localhost:8000/message")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message));
  // }, []);

  return (
    <DataContextProvider>
      <div className='title'>
        <h2>Visual Cluster Analysis</h2>
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
              Pipe Section: <strong>{selectedPoint.pipeSectionId}</strong> <br/>
              Thickness: <strong>{selectedPoint.pipeThickness} mm</strong>
            </div>
          )}
        </div>
        <Legend onReset={handleReset} />
      </div>
      <div className="chart-section">
          <BarChart />
      </div>
    </DataContextProvider>
  );
}
