import React from 'react'
import Trend from './Trend'

const TrendChart = ({ title }) => {
  return (
    <>
    <div className="container text-center" style={{ color: "#FFF", margin: '30px' }}>
    ---- {title} TREND CHARTS HERE ---- <br/><br/>

      <div class="row">
          <div class="col">
            <Trend />
          </div>
          <div class="col">
            <Trend />
          </div>
          <div class="col">
            <Trend />
          </div>
        </div>

        <div class="row">
          <div class="col">
            <Trend/>
          </div>
          <div class="col">
            <Trend/>
          </div>
          <div class="col">
            <Trend/>
          </div>
        </div>

      </div>

    
    </>
  )
}

export default TrendChart
