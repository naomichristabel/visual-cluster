import React, { useState } from 'react';
import styles from './WorkOrder.module.css'; // Import CSS module

const WorkOrder = () => {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  const handleRowClick = (workOrder) => {
    setSelectedWorkOrder(workOrder);
  };

  return (
    <div className={styles.workOrderContainer}>
      <br /><br /><br />
      <h4>WORK ORDERS</h4>
      <br />

      <div className="row">
        <div className="col-md-6 m-3">
          <table className={`table table-striped ${styles.table}`}>
            <thead className="thead table-secondary">
              <tr>
                <th>Work Order</th>
                <th>Pipe ID</th>
                <th>Pipe Section ID</th>
                <th>Circumference ID</th>
                <th>Assigned Information</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.row} onClick={() => handleRowClick({ workOrder: '0002210465', assignedInfo: 'Replace the pipe section' })}>
                <td>0002210465</td>
                <td>10-PF-G2-332001</td>
                <td>2210</td>
                <td>465</td>
                <td>Replace the pipe section</td>
              </tr>
              <tr className={styles.row} onClick={() => handleRowClick({ workOrder: '0002202465', assignedInfo: 'Cut the pipe section and repair' })}>
                <td>0002202465</td>
                <td>10-PF-G2-332001</td>
                <td>2202</td>
                <td>465</td>
                <td>Cut the pipe section and repair</td>
              </tr>
              <tr className={styles.row} onClick={() => handleRowClick({ workOrder: '0002368510', assignedInfo: 'Repair the pipe section' })}>
                <td>0002368510</td>
                <td>10-PF-G2-332001</td>
                <td>2368</td>
                <td>510</td>
                <td>Repair the pipe section</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={`col-md-5 card mt-3 ${styles.selectedWorkOrder}`}>
          {selectedWorkOrder && (
            <div className="mt-3">
              <h5>Work Order: {selectedWorkOrder.workOrder}</h5>
              <hr />
              <p><strong>Assigned Information: </strong>{selectedWorkOrder.assignedInfo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkOrder;
