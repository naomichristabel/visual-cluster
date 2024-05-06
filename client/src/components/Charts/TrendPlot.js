import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useContext, useState } from "react";
import { COLOURS } from "../../utils/Contants";
import DataContext from "../../store/DataProvider";
//import { html } from "@observablehq/stdlib";

const TrendPlot = ({ direction }) => {
    const plotRef = useRef();

    const [coordinates, setCoordinates] = useState([])

    const pipeCtx = useContext(DataContext);

    useEffect(() => {
      if(coordinates?.length > 0) {
//console.log(coordinates)
        const linePlot = Plot.plot({
                marks: [
                    Plot.frame({fill: COLOURS.darkGrey}),
                    Plot.gridY({stroke: COLOURS.grey, strokeOpacity: 1}),
                    Plot.line(coordinates?.map((d, i) => {
                        //console.log('x: ',d.pipeSection, ' y: ', parseFloat(d.pipeThickness))
                        return ({ x: d.pipeSection, y: parseFloat(d.pipeThickness) })
                    }), {x: "x", y: "y", stroke: "white", strokeWidth: 3, tip: true }),  
                    // Plot.tip(coordinates?.map((d, i) => ({ x: d.pipeSection, y: parseFloat(d.pipeThickness) })))     
                    // Plot.tip(coordinates?.map((d, i) => ({
                    //     x: d.pipeSection,
                    //     y: parseFloat(d.pipeThickness)
                    // }))) 
                    // Plot.tip(coordinates?.map(d => `Pipe Section: ${d.pipeSection}\nPipe Thickness: ${d.pipeThickness}`), {
                       
                        
                    //     fill: "red"
                    //   })
                ],
                x: { label: "Pipe Section", labelAnchor: "center", labelOffset: 30 },
                y: { label: "Pipe Thickness (mm)", labelAnchor: "center", labelOffset: 40 },
                 //marksTooltip: true // Enable tooltips for all marks
                // marginTop: 50,
                // marginBottom: 50,
                // marginLeft: 50,
                // marginRight: 50,
            });

            plotRef.current.append(linePlot);

            return () => linePlot.remove();
        }
    }, [coordinates])

    useEffect(() => {
        if (pipeCtx?.pipeData?.length > 0) {
        
        let sectionMin = Math.min(...pipeCtx?.pipeData?.map(d => d.pipeSectionId))

        setCoordinates(
            pipeCtx?.pipeData?.map(d => ({
                pipeThickness: d.pipeThickness,
                pipeSection: d.pipeSectionId - sectionMin
            })))     
        }
    }, [pipeCtx?.pipeData]);

    return (
        <>
        <figcaption>{direction}</figcaption>
        <div ref={plotRef}></div>
        </>
    );
}

export default TrendPlot;
