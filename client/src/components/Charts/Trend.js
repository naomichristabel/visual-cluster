import React, { useRef, useContext, useState, useEffect } from 'react';
import * as Plot from "@observablehq/plot";
import DataContext from '../../store/DataProvider'; 
import { prepareXAxisData, prepareYAxisData } from './BarChart';

const Trend = () => {
    const plotRef = useRef();
    const pipeCtx = useContext(DataContext);
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(pipeCtx.pipeData);
    }, [pipeCtx?.pipeData]);

    useEffect(() => {
        if (data?.length > 0) {
            const filteredData = prepareXAxisData(data);
            const numberOfUniqueCountPercents = prepareYAxisData(data);
console.log(filteredData)
console.log(numberOfUniqueCountPercents)
            const lineChart = Plot.plot({
                marks: [
                    Plot.line(filteredData, numberOfUniqueCountPercents),
                    Plot.dot(filteredData, numberOfUniqueCountPercents)
                ],
                x: { grid: true },
                y: { grid: true }
            });

            plotRef.current.innerHTML = '';
            plotRef.current.appendChild(lineChart);

            return () => {
                lineChart.remove();
            };
        }
    }, [data]);

    return (
        <div>
            <p>Trend</p>
            <div ref={plotRef} className='controls line-chart'></div>
        </div>
    );
}

export default Trend;
