import React, { useEffect, useState } from 'react'
import DataContext from '../../store/DataProvider.js';
import "bootstrap-icons/font/bootstrap-icons.css"
import { COLOURS } from '../../utils/Contants'

const IconsContainer = (props) => {
    const [showCheckboxes, setShowCheckboxes] = useState(false);

    const pipeCtx = React.useContext(DataContext)

    const handleDeselectAll = () => {
        pipeCtx.setSelectedOptionsHandler([]);
      };

    const handleReset = () => {
        props.onReset(true);
    }

    const handleShowCheckboxes = () => {
        setShowCheckboxes(prevShowCheckbox => !prevShowCheckbox)
    }

    useEffect( ()=>{
        console.log('show / hide', showCheckboxes)
        props.toggleCheckboxesHandler(showCheckboxes);
    },[showCheckboxes])

    useEffect(() => {
        if (props?.isReset) {
          handleDeselectAll();
        }
      }, [props?.isReset]);

  return (
    <div className="icons-container row" style={{color: COLOURS.white}}>
        <div className='col-md-4 single-icon'>
            <i class="bi bi-info-circle h4"></i>
        </div>
        <div className='col-md-4 single-icon' onClick={handleShowCheckboxes}>
            <i class="bi bi-stack h4"></i>
        </div>
        <div className='col-md-4 single-icon' onClick={handleReset}>
            <i className="bi bi-arrow-counterclockwise h4"></i>
        </div>
    </div>
  )
}

export default IconsContainer
