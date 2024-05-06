import React, { useEffect, useState } from 'react'
import TrendPlot from './TrendPlot'
import { LABEL, YEARS } from '../../utils/Contants'

const TrendContainer = ({ title }) => {
  const [selectedYear, setSelectedYear] = useState('')

  return (
    <>
    <div className="container text-center" style={{ color: "#FFF", margin: '30px' }}>

    {(title === LABEL.trendTabs.current) && <h6>{YEARS[title.toLowerCase()]}</h6>}

    {(title !== LABEL.trendTabs.current) &&
      <select onChange={e => setSelectedYear(e.target.value)}>
        { YEARS[title.toLowerCase()]?.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        )) }
      </select>
    }

      <div className="row trend-container">
          {/* <div className="col">
            <LinePlot direction={LABEL.direction.n} pipeThicknessValues={[18.7, 19.1, 18.6, 18.8, 18.9, 19.5]} pipeSections={[1, 2, 3, 4, 5, 6]} />
          </div> */}
           <div className="col">
            <TrendPlot direction={LABEL.direction.n} />
          </div>
          <div className="col">
            <TrendPlot direction={LABEL.direction.e} />
          </div>
        </div>

        <div className="row">
        <div className="col">
            <TrendPlot direction={LABEL.direction.w} />
          </div>
          <div className="col">
            <TrendPlot direction={LABEL.direction.s} />
          </div>
        </div>

      </div>

    
    </>
  )
}

export default TrendContainer
