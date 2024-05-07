import React, { useContext, useState } from 'react'
import { COLOURS, PIPE_CONSTANTS } from '../../utils/Contants.js';
import DataContext from '../../store/DataProvider.js';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Legend = (props) => {
    const [checkedOptions, setCheckedOptions] = useState({ a: false, b: false, c: false, d: false })
    const [isReset, setIsReset] = useState(false);

    const pipeCtx = useContext(DataContext);

    const handleChecked = ({ id, checked }) => {
        setCheckedOptions({ ...checkedOptions, [id]: checked })
    }

    React.useEffect(() => {
      const checkedTrueOptions = Object.entries(checkedOptions)
                                                .filter(([key, value]) => value === true)
                                                    .map(([key, value]) => key);
      pipeCtx.setSelectedOptionsHandler(checkedTrueOptions)
    }, [checkedOptions])

    React.useEffect(() => {
        if(pipeCtx?.selectedOptions?.length > 0) {
            setIsReset(false)
        } 
         else {
            setIsReset(true)
            props.onReset()
        }
      }, [pipeCtx?.selectedOptions])

      React.useEffect(() => {
        if(isReset) 
            setCheckedOptions(prev => ({ ...prev, a: false, b: false, c: false, d: false }));
      }, [isReset]);

  return (
    <div className='pipe-legend'>
        <p>{`Minimum Acceptable Threshold (MAT): ${PIPE_CONSTANTS.minAcceptableThreshold} mm`}</p>
 
         <FormGroup row className="form-group">
            <FormControlLabel
               label={`< MAT`}
               control={ <Checkbox id='a' checked={isReset ? !isReset : checkedOptions['a']} sx={{ "& .MuiSvgIcon-root": { fill: COLOURS.red }, '& .MuiIconButton-root': { padding: '6px' } }} size="small" /> }
               sx={{ '& .MuiFormControlLabel-label': { color: COLOURS.red, fontSize: '8px' } }}
               onChange={(event) => handleChecked(event.target)}
            />
            <FormControlLabel
               label={`< 5% of MAT`}
               control={ <Checkbox id='b' checked={isReset ? !isReset : checkedOptions['b']} sx={{ "& .MuiSvgIcon-root": { fill: COLOURS.amber }, '& .MuiIconButton-root': { padding: '6px' } }} size="small" /> }
               sx={{ '& .MuiFormControlLabel-label': { color: COLOURS.amber, fontSize: '8px' } }}
               onChange={(event) => handleChecked(event.target)}
            />
            <FormControlLabel
               label={`5% to 10% of MAT`}
               control={ <Checkbox id='c' checked={isReset ? !isReset : checkedOptions['c']} sx={{ "& .MuiSvgIcon-root": { fill: COLOURS.yellow }, '& .MuiIconButton-root': { padding: '6px' } }} size="small" /> }
               sx={{ '& .MuiFormControlLabel-label': { color: COLOURS.yellow, fontSize: '8px' } }}
               onChange={(event) => handleChecked(event.target)}
            />
            <FormControlLabel
               label={`> 10% of MAT`}
               control={ <Checkbox id='d' checked={isReset ? !isReset : checkedOptions['d']} sx={{ "& .MuiSvgIcon-root": { fill: COLOURS.green }, '& .MuiIconButton-root': { padding: '6px' } }} size="small" /> }
               sx={{ '& .MuiFormControlLabel-label': { color: COLOURS.green, fontSize: '8px' } }}
               onChange={(event) => handleChecked(event.target)}
            />
         </FormGroup>
    </div>
  )
}

export default Legend
