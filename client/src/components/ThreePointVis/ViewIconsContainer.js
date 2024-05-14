import React, { useEffect, useState, useContext } from 'react'
import DataContext from '../../store/DataProvider.js';
import "bootstrap-icons/font/bootstrap-icons.css"
import { COLOURS, LABEL } from '../../utils/Contants.js'

const ViewIconsContainer = (props) => {

    const pipeCtx = useContext(DataContext);

    const [minSlopeDirection, setMinSlopeDirection] = useState(null);
    const [showPipe, setShowPipe] = useState({ 
        full: true, 
        half: {
          west: false,
          east: false,
          north: false,
          south: false
        },
        quad:  {
          northWest: false,
          northEast: false,
          southWest: false,
          southEast: false
        }
      });

    const handleViewChange = (e) => {
        let direction = e.currentTarget.id;

        if(direction === LABEL.strongestDecline) {
          setShowPipe(prevState => ({
            ...prevState,
            half: {
              ...prevState.half,
              west: LABEL.direction.w.toLowerCase() === minSlopeDirection,
              east: LABEL.direction.e.toLowerCase() === minSlopeDirection,
              north: LABEL.direction.n.toLowerCase() === minSlopeDirection,
              south: LABEL.direction.s.toLowerCase() === minSlopeDirection,
            },
            quad: {
              northWest: false,
              northEast: false,
              southWest: false,
              southEast: false,
            },
            full: direction === LABEL.direction.full
          }));
        } else {
            setShowPipe(prevState => ({
              ...prevState,
              half: {
                ...prevState.half,
                west: direction === LABEL.direction.w,
                east: direction === LABEL.direction.e,
                north: direction === LABEL.direction.n,
                south: direction === LABEL.direction.s,
              },
              quad: {
                northWest: false,
                northEast: false,
                southWest: false,
                southEast: false,
              },
              full: direction === LABEL.direction.full
            }));
        }

    }

    useEffect(() => {
        // console.log(showPipe)
        props.onViewChange(showPipe);
    }, [showPipe])

    useEffect(() => {
      setMinSlopeDirection(pipeCtx?.minSlopeDirection)
    }, [pipeCtx?.minSlopeDirection]);

  return (
    <div className="view-icons-container row" style={{color: COLOURS.white, width: '500px', marginRight: '-12%', marginBottom: '-12px' }}>
        <div id={LABEL.direction.n} className='col-md-2 single-icon' onClick={handleViewChange}>
            <img src="./assets/icons/north.svg" width={60} height={60} alt="North Icon" />
        </div>
        <div id={LABEL.direction.s} className='col-md-2 single-icon' onClick={handleViewChange}>
            <img src="./assets/icons/south.svg" width={60} height={60} alt="South Icon" />
        </div>
        <div id={LABEL.direction.e} className='col-md-2 single-icon' onClick={handleViewChange}>
            <img src="./assets/icons/east.svg" width={60} height={60} alt="East Icon" />
        </div>
        <div id={LABEL.direction.w} className='col-md-2 single-icon' onClick={handleViewChange}>
            <img src="./assets/icons/west.svg" width={60} height={60} alt="West Icon" />
        </div>
        <div id={LABEL.direction.full} className='col-md-2 single-icon' onClick={handleViewChange}>
            <img src="./assets/icons/strongest-decline.svg" width={32} height={32} alt="Full Pipe Icon" style={{ marginBottom: '-22px' }}/>
        </div>
        <div id={LABEL.strongestDecline} className='col-md-2 single-icon' onClick={handleViewChange}>
            <img src="./assets/icons/reduce-white.png" width={32} height={32} alt="Strongest Decline Icon" style={{ marginBottom: '-22px' }} />
        </div>

    </div>
  )
}

export default ViewIconsContainer
