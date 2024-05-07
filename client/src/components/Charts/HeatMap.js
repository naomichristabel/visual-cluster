import React, { useContext, useEffect, useState } from 'react'
import DataContext from '../../store/DataProvider'

const HeatMap = ({ onCorrelationCalc }) => {
  const pipeCtx = useContext(DataContext);

  const [pipeData, setPipeData] = useState([{ pearsonCorrelation: '' }]);
  const [data, setData] = useState();

useEffect(() => {
  if (data?.length > 0) {
    // Extract pipe section IDs and circumference IDs
    const pipeSectionIds = data.map(entry => entry.pipeSectionId);
    const circumferenceIds = Object.keys(data[0]).filter(key => key !== 'pipeSectionId');

    // Extract pipe thickness values into a matrix
    const pipeThicknessMatrix = pipeSectionIds.map(pipeSectionId =>
      circumferenceIds.map(circumferenceId =>
        parseFloat(data.find(entry => entry.pipeSectionId === pipeSectionId)[circumferenceId])
      )
    );

    // Function to calculate mean
    const mean = arr => arr.reduce((acc, val) => acc + val, 0) / arr.length;

    // Function to calculate Pearson correlation coefficient
    const pearsonCorrelation = (x, y) => {
      const meanX = mean(x);
      const meanY = mean(y);
      const n = x.length;

      let numerator = 0;
      let denominatorX = 0;
      let denominatorY = 0;

      for (let i = 0; i < n; i++) {
        numerator += (x[i] - meanX) * (y[i] - meanY);
        denominatorX += (x[i] - meanX) ** 2;
        denominatorY += (y[i] - meanY) ** 2;
      }

      const correlation = numerator / Math.sqrt(denominatorX * denominatorY);

      return correlation;
    };

    // Calculate Pearson correlation coefficient matrix
    const correlationMatrix = [];
    const updatedPipeData = pipeData.map(dataEntry => {
      const newDataEntry = { ...dataEntry }; // Create a copy of the original data entry
      const pipeSectionIdIndex = pipeSectionIds.indexOf(dataEntry.pipeSectionId);

      if (pipeSectionIdIndex !== -1) {
        correlationMatrix[pipeSectionIdIndex] = [];

        for (let j = 0; j < circumferenceIds.length; j++) {
          const x = pipeThicknessMatrix[pipeSectionIdIndex];
          const y = pipeThicknessMatrix.map(row => row[j]);

          const meanX = mean(x);
          const meanY = mean(y);

          const stdDevX = Math.sqrt(x.reduce((acc, val) => acc + (val - meanX) ** 2, 0) / x.length);
          const stdDevY = Math.sqrt(y.reduce((acc, val) => acc + (val - meanY) ** 2, 0) / y.length);

          if (stdDevX !== 0 && stdDevY !== 0) {
            correlationMatrix[pipeSectionIdIndex][j] = pearsonCorrelation(x, y);
          } else {
            correlationMatrix[pipeSectionIdIndex][j] = 0; // Set correlation to zero if standard deviation is zero
          }

          // Assign Pearson coefficient to newDataEntry
          newDataEntry.pearsonCorrelation = correlationMatrix[pipeSectionIdIndex][j];
        }
      }

      return newDataEntry;
    });

    // Update pipeData state
    setPipeData(updatedPipeData);
  }
}, [data]);


  useEffect(()=>{
    if(pipeData?.length > 1) {
      onCorrelationCalc(pipeData)
    }
  }, [pipeData])

  useEffect(() => {
    if(pipeCtx?.pipeData?.length > 0) {
    setPipeData(pipeCtx?.pipeData);

    const restructuredData = pipeCtx?.pipeData.reduce((acc, curr) => {
      acc[curr.pipeSectionId] = acc[curr.pipeSectionId] || {};
      acc[curr.pipeSectionId][curr.circumferenceId] = curr.pipeThickness;
      return acc;
  }, {});
  
  if (restructuredData) {
  const result = Object.entries(restructuredData).map(([pipeSectionId, thicknessByCircumference]) => ({
      pipeSectionId,
      ...thicknessByCircumference
  }));

  //console.log('restructuring result - ', result);
  setData(result);
}
    }
  }, [pipeCtx?.pipeData]);

  return (
    <div style={{ textAlign: 'center' }} >
       <h4>Heat Map</h4>
    </div>
  )
}

export default HeatMap
