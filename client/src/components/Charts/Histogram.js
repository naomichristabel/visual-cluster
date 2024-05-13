import React, { useRef, useEffect, useState, useContext } from 'react'
import * as Plot from "@observablehq/plot";
import DataContext from '../../store/DataProvider.js';
import { COLOURS, PIPE_CONSTANTS } from '../../utils/Contants.js';
import * as d3 from 'd3';

// Kernel density estimation function
function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
    };
}

// Epanechnikov kernel function
function epanechnikovKernel(scale) {
    return function(u) {
        return Math.abs(u /= scale) <= 1 ? 0.75 * (1 - u * u) / scale : 0;
    };
}

// Calculate statistical measures for the distribution curve chart
function calculateMeasures(kdeData) {
    // Calculate minimum, maximum, average, and standard deviation for the distribution curve
  //const kdeData = kde.map(d => d[1]); // Extracting the KDE values
  const minKDE = Math.min(...kdeData);
  const maxKDE = Math.max(...kdeData);
  const sumKDE = kdeData.reduce((acc, val) => acc + val, 0);
  const averageKDE = sumKDE / kdeData.length;
  const varianceKDE = kdeData.reduce((acc, val) => acc + (val - averageKDE) ** 2, 0) / kdeData.length;
  const stdDevKDE = Math.sqrt(varianceKDE);

  // console.log("Minimum KDE:", minKDE);
  // console.log("Maximum KDE:", maxKDE);
  // console.log("Average KDE:", averageKDE);
  // console.log("Standard Deviation KDE:", stdDevKDE);

  return {
    min: minKDE.toFixed(3),
    max: maxKDE.toFixed(3),
    average: averageKDE.toFixed(3),
    stdDev: stdDevKDE.toFixed(3)
  }
}

//Scott's normal reference rule for determining the number of bins
function calculateThresholds(data) {
  const n = data.length;
  const range = Math.max(...data) - Math.min(...data);
  const stdev = d3.deviation(data);
  const h = 3.5 * stdev * Math.pow(n, -1 / 3);
  const bins = Math.ceil(range / h);

  //console.log('Number of bins / thresholds: ',bins)

  return bins;
}


const Histogram = () => {
    const chartRef = useRef();

    const [measures, setMeasures] = useState({ min: null, max: null, average: null, stdDev: null });

    const pipeCtx = useContext(DataContext)

      // Define color function to apply colors based on pipeThickness values
  const color = (d) => {
    if (d.pipeThickness < ((0.03 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
      return COLOURS.purple
    } else if (d.pipeThickness > ((0.03 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold) && d.pipeThickness < ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
      return COLOURS.red
    } else if (d.pipeThickness > ((0.05 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold) && d.pipeThickness < ((0.1 * PIPE_CONSTANTS.minAcceptableThreshold) + PIPE_CONSTANTS.minAcceptableThreshold)) {
      return COLOURS.yellow
    }
    }

  useEffect(() => {
    
if(pipeCtx?.pipeData?.length > 0) {

    // Calculate domain for x-axis
    const xDomain = [
        Math.min(...pipeCtx?.pipeData.map(d => d.pipeThickness)) - 2,
        Math.max(...pipeCtx?.pipeData.map(d => d.pipeThickness)) + 2
    ];

     // Kernel density estimation
     const kde = kernelDensityEstimator(epanechnikovKernel(2), Array.from({length: 200}, (_, i) => xDomain[0] + i * ((xDomain[1] - xDomain[0]) / 200)))(pipeCtx?.pipeData.map(d => d.pipeThickness));

     setMeasures(calculateMeasures(pipeCtx?.pipeData.map(d => d.pipeThickness)));

    const binChart = Plot.plot({
        marks: [
          Plot.frame({ fill: COLOURS.white }),
          Plot.gridX({stroke: COLOURS.lightGrey, strokeOpacity: 1, strokeDasharray: "2,2"}),
          Plot.gridY({stroke: COLOURS.lightGrey, strokeOpacity: 1, strokeDasharray: "2,2"}),
          Plot.rectY(
            pipeCtx?.pipeData,
            Plot.binX(
              { y: "proportion" },
              { 
                x: "pipeThickness", 
                fill: color,
                thresholds: calculateThresholds(pipeCtx.pipeData.map(d => d.pipeThickness)) > 5 ? 10 : calculateThresholds(pipeCtx.pipeData.map(d => d.pipeThickness)), // Adjust the number of thresholds for finer intervals
                title: d => `Pipe Thickness: ${d.pipeThickness} mm` // Tooltip title showing pipeThickness value
              },
            )
          ),
          Plot.line(kde, { stroke: COLOURS.white, strokeWidth: 1 }),
          Plot.line(kde, { stroke: COLOURS.lightGrey, strokeWidth: 2 }),
          Plot.ruleY([0]),
        ],
        x: { label: "Pipe Thickness (mm)", domain: xDomain, labelAnchor: "center", labelOffset: 30 },
        y: { label: "Count (%)", grid: true, labelAnchor: "center", labelOffset: 40, tickFormat: ".0%" },
        // Enable tooltips
        marksTooltip: true,
        height: 300, // Set the desired height here
      });
      
      chartRef.current.append(binChart);

      return () => {
        binChart.remove();
    };
    }
  }, [pipeCtx?.pipeData]);

  return (
    <div>
      <div className='title'>
        <h5>Histogram with distribution curve chart</h5>
      </div>
      
      <div ref={chartRef} />

      <div className='title measures'>
        <span>{`Min: ${measures.min} - Max: ${measures.max} - Avg: ${measures.average} - Std. Dev: ${measures.stdDev}`}</span>
      </div>

      <div className="histogram-legend">
          <div className="histogram-legend-title">Minimum Acceptable Threshold (MAT): <br/> 18.96mm</div>
          <div className="histogram-legend-items">
            <div className="histogram-legend-item">
              <div className="histogram-legend-box" style={{ background: "purple" }}></div>
              <div className="histogram-legend-label">&lt; 3% of MAT</div>
            </div>
            <div className="histogram-legend-item">
              <div className="histogram-legend-box" style={{ background: "red" }}></div>
              <div className="histogram-legend-label">3% to 5% of MAT</div>
            </div>
            <div className="histogram-legend-item">
              <div className="histogram-legend-box" style={{ background: "yellow" }}></div>
              <div className="histogram-legend-label">5% to 10% of MAT</div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Histogram
