import * as React from 'react';
import ThreePointVis from './components/ThreePointVis/ThreePointVis';
import './styles.css';
import { PIPE_CONSTANTS } from './utils/Contants';
import { DataContextProvider } from './store/DataProvider';

//const data = new Array(PIPE_CONSTANTS.pipeSectionCount).fill(0).map((d, id) => ({ id: id + 1, d: Math.round(Math.random() * 1000) / 1000 }));
//const data = [{ id: 1500 }, { id: 1704 }, { id: 1620 }, { id: 1980 }, { id: 2000 }, { id: 2200 }, { id: 1840 }]

export default function App() {
  const [layout, setLayout] = React.useState('grid');
  const [selectedPoint, setSelectedPoint] = React.useState(null);

  const visRef = React.useRef();

  const handleResetCamera = () => {
    visRef.current.resetCamera();
  };

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
        <button className="reset-button" onClick={handleResetCamera}>
          Reset
        </button>
        <div className="controls">
          {selectedPoint && (
            <div className="selected-point">
              Pipe Section: <strong>{selectedPoint.pipeSectionId}</strong> <br/>
              Thickness: <strong>{selectedPoint.pipeThickness} mm</strong>
            </div>
          )}
        </div>
        <div className='pipe-legend'>
          <h3>{`Minimum Acceptable Threshold (MAT): ${PIPE_CONSTANTS.minAcceptableThreshold} mm`}</h3>
          <dl>
            <dt class="red"></dt><dd>{`< MAT`}</dd>
            <dt class="amber"></dt><dd>{`< 5% of MAT`}</dd>
            <dt class="yellow"></dt><dd>{`5% to 10% of MAT`}</dd>
            <dt class="green"></dt><dd>{`> 10% of MAT`}</dd>
          </dl>
        </div>
      </div>
      <div className="chart-section">
        <div className='title'>
          <h2>Chart</h2>
        </div>
        <div className='controls'>
          <p>Chart to be displayed here</p>
        </div>
      </div>
    </DataContextProvider>
  );
}
