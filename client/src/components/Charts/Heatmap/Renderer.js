import { useMemo } from "react";
import * as d3 from "d3";
import { MARGIN } from '../../../utils/Contants';
import styles from "./renderer.module.css";


export const Renderer = ({
  width,
  height,
  data,
  setHoveredCell,
  colorScale,
}) => {
  
  // bounds = area inside the axis
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const allYGroups = useMemo(() => [...new Set(data?.map((d) => d.y))], [data]);
  const allXGroups = useMemo(
    () => [...new Set(data?.map((d) => String(d.x)))],
    [data]
  );

  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.1);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsHeight])
      .domain(allYGroups)
      .padding(0.1);
  }, [data, height]);

  const allRects = data?.map((d, i) => {
    
    const xPos = xScale(String(d.x));
    const yPos = boundsHeight - yScale(d.y); // Subtract yPos from boundsHeight to reverse direction

    if (d.value === null || !xPos || !yPos) {
      return;
    }

    return (
      <rect
        key={i}
        x={xPos}
        y={yPos}
        className={styles.rectangle}
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        fill={(d.pearsonCorrelation !== null) ? colorScale(d.pearsonCorrelation) : "#F8F8F8"}
        // fill={d.pearsonCorrelation ? colorScale(d.pearsonCorrelation) : "#F8F8F8"}
        onMouseEnter={(e) => {
          setHoveredCell({
            xLabel: String(d.x),
            yLabel: d.y,
            xPos: xPos + xScale.bandwidth() + MARGIN.left,
            yPos: yPos + xScale.bandwidth() / 2 + MARGIN.top,
            value: d.value ? Math.round(d.value * 100) / 100: null,
            corr: d.pearsonCorrelation ? d.pearsonCorrelation.toFixed(2) : null
          });
        }}
      />
    );
  });

  const xLabels = allXGroups.map((name, i) => {
    const xPos = xScale(name) + xScale.bandwidth() / 2;
    const yPos = boundsHeight + 40; 

    //if (name && Number(name) % 10 === 0) {
      return (
        <text
          key={i}
          x={xScale(name)}
          y={yPos}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={8}
          stroke="none"
          fill="white"
          transform={`rotate(-90, ${xPos}, ${yPos})`} // Rotate the text by -90 degrees
        >
          {name}
        </text>
      );
    //}
  });

  const yLabels = allYGroups.map((name, i) => {
    const yPos = boundsHeight - yScale(name) + (yScale.bandwidth() / 2) + 30;
    // if (yPos && i % 2 === 0) {
      return (
        <text
          key={i}
          x={-5}
          y={yPos + (yScale.bandwidth() / 2) - 40}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={8}
          fill="white"
        >
          {name}
        </text>
      );
   // }
  });

  const xAxisLabel = 
    <text
        x={boundsWidth / 2} // Center the label horizontally
        y={boundsHeight + MARGIN.bottom + 30} // Adjust the position vertically
        textAnchor="middle" // Center the text
        dominantBaseline="hanging" // Position the text below the axis
        fontSize={8}
        fill="white"
    >
        Pipe Section ID
    </text>

  const yAxisLabel = 
    <text
        x={-boundsHeight / 2} // Center the label vertically
        y={-MARGIN.left + 10} // Adjust the position horizontally
        textAnchor="middle" // Center the text
        dominantBaseline="hanging" // Position the text to the left of the axis
        fontSize={8}
        fill="white"
        transform={`rotate(-90)`} // Rotate the label for vertical orientation
    >
        Circumference ID
    </text>

  return (
    <svg
      width={width}
      height={height + MARGIN.top + MARGIN.bottom}
      onMouseLeave={() => setHoveredCell(null)}
    >
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allRects}
        {xLabels}
        {yLabels}

        {xAxisLabel}
        {yAxisLabel}

      </g>
    </svg>
  );
};