import { createContext, useState, useEffect } from "react";

const DataContext = createContext();

export const DataContextProvider = (props) => {
    const [pipeData, setPipeData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const setPipeDataHandler = (data) => {
        setPipeData(data);
    }

    const setSelectedOptionsHandler = (data) => {
      setSelectedOptions(data);
    }

    useEffect(() => {

    const fetchData = async () => {
        try {
          const response = await fetch('./pipeData.json');
          const jsonData = await response.json();
        //   console.log('data',jsonData)
          setPipeData(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData(); 
   
    }, []);

    const contextValue = {
        pipeData, 
        setPipeDataHandler,
        selectedOptions,
        setSelectedOptionsHandler,
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