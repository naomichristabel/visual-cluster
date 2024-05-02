import * as React from 'react';
import { Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import Controls from './Controls';
import Cylinder from '../Pipeline/Cylinder';
import CylinderPoints from '../Pipeline/CylinderPoints';
import Effects from './Effects';
import { DataContextProvider } from '../../store/DataProvider';
import DataContext from '../../store/DataProvider';
import { PIPE_CONSTANTS } from '../../utils/Contants';

const ThreePointVis = ({ data, layout, selectedPoint, onSelectPoint }, ref) => {
  const pipeCtx = React.useContext(DataContext);
  const [pipeData, setPipeData] = React.useState([]);
  const [pipeLength, setPipeLength] = React.useState();
  
  React.useEffect(()=>{
   //console.log('in useEff context data : ', pipeCtx.pipeData)
   
    if(pipeCtx?.pipeData?.length > 0) {
      setPipeData(pipeCtx.pipeData)
      setPipeLength((Math.max(...pipeCtx.pipeData.map(item => parseInt(item.pipeSectionId))) - Math.min(...pipeCtx.pipeData.map(item => parseInt(item.pipeSectionId)))) / PIPE_CONSTANTS.pipeSectionScaleFactor)
    }
  },[pipeCtx?.pipeData])

  // React.useEffect(() => {console.log('state data in CP component...',pipeData)}, [pipeData])

  const controlsRef = React.useRef();
  React.useImperativeHandle(ref, () => ({
    resetCamera: () => {
      return controlsRef.current.resetCamera();
    },
  }));

  return (
    <Canvas camera={{ position: [0, 0, 30], far: 15000 }}>
        <Suspense fallback={null}>
          <Controls ref={controlsRef}/>
          <ambientLight color="#ffffff" intensity={0.1} />
          <hemisphereLight
            color="#ffffff"
            skyColor="#ffffbb"
            groundColor="#080820"
            intensity={1.0}
          />
          <group position={[-50, 0, 0]}>
            <Cylinder height={pipeLength}/>
            <CylinderPoints 
              data={pipeData}
              layout={layout}
              selectedPoint={selectedPoint}
              onSelectPoint={onSelectPoint}/>
          </group>
            <Effects />
        </Suspense>
    </Canvas>
  );
};

export default  React.forwardRef(ThreePointVis);
