import React, { useState, useEffect } from 'react';
import ThreePointVis from './components/ThreePointVis/ThreePointVis.js';
import './styles.css';
import { PIPE_CONSTANTS, COLOURS, LABEL } from './utils/Contants.js';
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
import Modal from './components/ThreePointVis/Modal.js';
import Configuration from './components/Charts/Configuration.js';

//const data = new Array(PIPE_CONSTANTS.pipeSectionCount).fill(0).map((d, id) => ({ id: id + 1, d: Math.round(Math.random() * 1000) / 1000 }));
//const data = [{ id: 1500 }, { id: 1704 }, { id: 1620 }, { id: 1980 }, { id: 2000 }, { id: 2200 }, { id: 1840 }]

export default function Home() {
  const [layout, setLayout] = useState('grid');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selPointColour, setSelPointColour] = useState();
  const [loading, setLoading] = useState(true);  
  const [isReset, setIsReset] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [showPlanes, setShowPlanes] = useState(false);
  const [newPipeData, setNewPipeData] = useState( {[LABEL.direction.nw]: [], [LABEL.direction.sw]: [], [LABEL.direction.ne]: [], [LABEL.direction.se]: []} );
  const [newFullDataset, setNewFullDataset] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visRef = React.useRef();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleResetCamera = (flag) => {
    setIsReset(flag);
    visRef.current.resetCamera();
  };

  const handleToggleCheckbox = (flag) => {
    setShowCheckboxes(flag)
  }

  const handleTogglePlanes = () => {
    setShowPlanes(prevShowPlanes => !prevShowPlanes)
  }

  const handlePipeDataUpdate = (direction, subDataset, fullDataset) => {
    setNewFullDataset(fullDataset)

    if(direction === LABEL.direction.nw)
      setNewPipeData(prev => ({ ...prev, [LABEL.direction.nw]: subDataset}))
    else if(direction === LABEL.direction.ne)
      setNewPipeData(prev => ({ ...prev, [LABEL.direction.ne]: subDataset}))
    else if(direction === LABEL.direction.sw)
      setNewPipeData(prev => ({ ...prev, [LABEL.direction.sw]: subDataset}))
    else if(direction === LABEL.direction.se)
      setNewPipeData(prev => ({ ...prev, [LABEL.direction.se]: subDataset}))
  }

  const handleGenerateWorkOrder = () => {
    window.open('/work_order', '_blank')
  }

  useEffect(() => {
    if (selectedPoint?.pipeThickness < PIPE_CONSTANTS.minAcceptableThreshold) {
      setSelPointColour(COLOURS.red)
    } else if ((selectedPoint?.pipeThickness > PIPE_CONSTANTS.minAcceptableThreshold) && (selectedPoint?.pipeThickness < ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold))) {
      setSelPointColour(COLOURS.amber)
    } else if (selectedPoint?.pipeThickness > ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold) && selectedPoint?.pipeThickness < ((0.10 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
      setSelPointColour(COLOURS.yellow)
    } else if (selectedPoint?.pipeThickness > ((0.10 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
      setSelPointColour(COLOURS.green)
    }
  }, [selectedPoint]);

  const getTooltipClassName = () => {
    if (selPointColour === COLOURS.red) {
      return 'tooltip-red';
    } else if (selPointColour === COLOURS.amber) {
      return 'tooltip-amber';
    } else if (selPointColour === COLOURS.yellow) {
      return 'tooltip-yellow';
    } else if (selPointColour === COLOURS.green) {
      return 'tooltip-green';
    } else {
      // Default class name if selPointColour doesn't match any predefined colors
      return 'tooltip-default';
    }
  }
  
  return (
    <>
    <DataContextProvider>
      <div className='row m-3' style={{ backgroundColor: '#FFF'}}>
        <div className='row justify-content-between'>
          <div className='title col-md-5'>
            <h4>Overview Dashboard</h4>
          </div>
          <div className='title col-md-6 text-end mb-2'>
            <button className="btn btn-primary" onClick={handleGenerateWorkOrder}>Generate Work Order</button>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
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
                    showPlanes={showPlanes}
                  />
                </div>
          
                {selectedPoint && 
                  <div className="controls">
                      <span className='tooltip-label'>Pipe Section ID: </span> <br/>
                        <span className={getTooltipClassName()}>{selectedPoint?.pipeSectionId}</span> <br/>
                      <span className='tooltip-label'>Circumference ID: </span> <br/>
                        <span className='tooltip-black'>{selectedPoint?.circumferenceId}</span> <br/>
                      <span className='tooltip-label'>Thickness: </span> <br/>
                        <span className='tooltip-black'>{selectedPoint?.pipeThickness} mm</span>
                  </div>
                }
        
                {showCheckboxes && <Legend isReset={isReset} onReset={handleResetCamera} />}
 
                <IconsContainer isReset={isReset} onReset={handleResetCamera} toggleCheckboxesHandler={handleToggleCheckbox} onToggle={handleTogglePlanes} onOpenInfo={openModal}/>
               
                <Modal isOpen={isModalOpen} onClose={closeModal} />
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3 justify-content-between">
            <div className='col-md-6'>
              <div className='card p-3' style={{ height: '96%'}}><Histogram /></div>
            </div>
            <div className='col-md-6'> 
              <div><Configuration /></div>
            </div>
        </div>

        <div className='row' style={{ width: '98%', marginLeft: '2px'}}>
          <div className='col-md-6'  style={{ width: '49%' }}>

            <div className='row card' style={{ marginRight: '-5px'}}>
                <HeatMap onDistanceMeasureCalc={handlePipeDataUpdate} direction={LABEL.direction.nw}/> 
                <Heatmap width={500} height={300} newPipeData={newPipeData[LABEL.direction.nw]} newFullDataset={newFullDataset}/>
            </div>

            <div className='row card mt-3' style={{ marginRight: '-5px'}}>
            <HeatMap onDistanceMeasureCalc={handlePipeDataUpdate} direction={LABEL.direction.sw}/> 
                <Heatmap width={500} height={300} newPipeData={newPipeData[LABEL.direction.sw]} newFullDataset={newFullDataset}/>
            </div>
          </div>
          <div className='col-md-6' style={{ width: '49%', marginLeft: '15px' }}>
            <div className='row card' style={{ marginRight: '-20px'}}>
                <HeatMap onDistanceMeasureCalc={handlePipeDataUpdate} direction={LABEL.direction.ne}/> 
                <Heatmap width={500} height={300} newPipeData={newPipeData[LABEL.direction.ne]} newFullDataset={newFullDataset}/>
            </div>
            <div className='row card mt-3' style={{ marginRight: '-20px'}}>
              
                <HeatMap onDistanceMeasureCalc={handlePipeDataUpdate} direction={LABEL.direction.se}/> 
                <Heatmap width={500} height={300} newPipeData={newPipeData[LABEL.direction.se]} newFullDataset={newFullDataset}/>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div className='card mt-3 '>
                  <TrendTabs />
            </div>
          </div>
        </div>

      </div>
    </DataContextProvider>
    </>
  );
}
