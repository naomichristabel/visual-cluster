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

    const binChart = Plot.plot({
        marks: [
          Plot.frame({ fill: COLOURS.darkGrey }),
          Plot.gridY({stroke: COLOURS.grey, strokeOpacity: 1}),
          Plot.rectY(
            pipeCtx?.pipeData,
            Plot.binX(
              { y: "proportion" },
              { 
                x: "pipeThickness", 
                fill: color,
                thresholds: calculateThresholds(pipeCtx.pipeData.map(d => d.pipeThickness)) > 5 ? 10 : calculateThresholds(pipeCtx.pipeData.map(d => d.pipeThickness)), // Adjust the number of thresholds for finer intervals
                title: d => `Pipe Thickness: ${d.pipeThickness}` // Tooltip title showing pipeThickness value
              },
            )
          ),
          Plot.line(kde, { stroke: COLOURS.white, strokeWidth: 2 }),
          Plot.ruleY([0]),
        ],
        x: { label: "Pipe Thickness (mm)", domain: xDomain, labelAnchor: "center", labelOffset: 30 },
        y: { label: "Count (%)", grid: true, labelAnchor: "center", labelOffset: 40, tickFormat: ".0%" },
        // Enable tooltips
        marksTooltip: true,
        
      });
      
      chartRef.current.append(binChart);

      return () => {
        binChart.remove();
    };
    }
  }, [pipeCtx?.pipeData]);

  return (
    <div>
    <h4>Histogram with Distribution Curve Chart</h4>
    <div ref={chartRef} />
  </div>
  )
}

export default Histogram
