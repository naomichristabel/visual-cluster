import { createContext, useState, useEffect } from "react";

const DataContext = createContext();

export const DataContextProvider = (props) => {
    const [pipeData, setPipeData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [density, setDensity] = useState();
    const [correlationGridData, setCorrelationGridData] = useState();
    const [minSlopeDirection, setMinSlopeDirection] = useState(null);

    const setPipeDataHandler = (data) => {
        setPipeData(data);
    }

    const setSelectedOptionsHandler = (data) => {
      setSelectedOptions(data);
    }

    const setDensityHandler = (data) => {
      setDensity(data);
    }

    const setCorrelationGridDataHandler = (data) => {
      setCorrelationGridData(data);
    }

    const setMinSlopeDirectionHandler = (data) => {
      setMinSlopeDirection(data);
    }

    useEffect(() => {

    const fetchData = async () => {
        try {
          // const response = await fetch('./Sebastian/332001_c11_c21_ct2_ct3_complete.csv_df_plot.json');
          const response = await fetch('./Sebastian/332001_c11_c21_ct2_ct3_complete.csv_df_plot_array.json');
          //const response = await fetch('./pipeData.json');
          const jsonData = await response.json();
          //console.log('data',jsonData)
          //setPipeData(jsonData);

          const mappedData = [];

          jsonData.forEach(item => {
              const circumferenceValues = item["Circumference"].split(',');

              // If the Circumference contains a comma
              if (circumferenceValues.length > 1) {
                  circumferenceValues.forEach(circumference => {
                      const newItem = { ...item }; // Create a copy of the original object

                      // Replace the Circumference value with the split value
                      newItem["Circumference"] = circumference.trim(); // Remove leading/trailing spaces if any

                      // Add the modified object to the mappedData array
                      mappedData.push(newItem);
                  });
              } else {
                  // If no comma is found, simply add the original item to the mappedData array
                  mappedData.push(item);
              }
          });
          
          const newMappedData = mappedData.map(item => ({
            pipeThickness: item["Thickness values"],
            pipeSectionId: item["Pipe Section"],
            circumferenceId: item["Circumference"],
            count: item["count"],
            countPercent: item["% Occurence"]
          }));

          setPipeData(newMappedData);

          //console.log('new mapped data, splitting circumference IDS', newMappedData)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData(); 

    }, []);

    useEffect(() => {
      //On load of application, select all points on pipe that have thickness less than minimum acceptable threshold
      setSelectedOptions(['a'])
    }, [pipeData])

    const contextValue = {
        pipeData, 
        setPipeDataHandler,
        selectedOptions,
        setSelectedOptionsHandler,
        density,
        setDensityHandler,
        correlationGridData,
        setCorrelationGridDataHandler,
        minSlopeDirection,
        setMinSlopeDirectionHandler
    }

return (
    <DataContext.Provider value={contextValue}>
        {props.children}
    </DataContext.Provider>
);
}

// export const DataProvider = ({ children }) => {
//     const [pipeData, setPipeData] = useState([]);

//     useEffect(() => {

//     const fetchData = async () => {
//         try {
//           const response = await fetch('./pipeData.json');
//           const jsonData = await response.json();
//           console.log('data',jsonData)
//           setPipeData(jsonData);
//         } catch (error) {
//           console.error('Error fetching data:', error);
//         }
//       };
  
//       fetchData();
  
//     //   fetch('').then(response => {
//     //     return response.json();
//     //   }).then(data => {
//     //     // Work with JSON data here
//     //     console.log('data.............',data);
//     //     setPipeData(prevData => ([...prevData, data]));
//     //   }).catch(err => {
//     //     // Do something for an error here
//     //     console.log("Error Reading data " + err);
//     //   });
      
//         }, []);
    
//         useEffect(() => {console.log('pipeData changed', pipeData)}, [pipeData])
//     return <DataContext.Provider value={pipeData}>{children}</DataContext.Provider>;
// };

export default DataContext;