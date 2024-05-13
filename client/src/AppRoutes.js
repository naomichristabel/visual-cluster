import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WorkOrder from './components/WorkOrder/WorkOrder';
import Home from './Home';

const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/visual-cluster/client" element={<Home/>} />
        <Route path="/visual-cluster/client/work_order" element={<WorkOrder/>} />
      </Routes>
    );
  }
  
  export default AppRoutes;