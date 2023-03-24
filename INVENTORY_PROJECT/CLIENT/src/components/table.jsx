
// import React from 'react'
// import 'semantic-ui-css/semantic.min.css'
// import './style.css'
// import Addcomments from './addcomments';
// import Download from './download';
// const Table = ({ data, addtoform, geTable.Cellata, deletefromtable,downloadQR  }) => {

//     // data.sort((a,b)=>(a.date>b.date)?-1:1)
//    var tabledata = data.map((item, index) => (
//         <tr key={index}>
//             <Table.Cell>{item.id}</Table.Cell>
//             <Table.Cell>{item.category}</Table.Cell>
//             <Table.Cell>{item.userid}</Table.Cell>
//             <Table.Cell>{item.model}</Table.Cell>
//             <Table.Cell>{item.serial}</Table.Cell>
//             <Table.Cell>{item.date}</Table.Cell>
//             <Table.Cell>{item.comments}</Table.Cell>
//             <Table.Cell>{item.problems}</Table.Cell>
//             <Table.Cell><button onClick={() => downloadQR(item)} className="ui lightGrey button">QR Code</button></Table.Cell>
//             <Table.Cell><button onClick={addtoform} className="ui blue button"  >Edit</button></Table.Cell>
//             <Table.Cell><button onClick={()=>{deletefromtable(item.id)}} className="ui red button">Delete</button></Table.Cell>

//         </tr>
//     ))

//     return (

//         <div >
//              <Download data1={data} />
//              <Addcomments data={data} geTable.Cellata={geTable.Cellata} />

//             <table className="ui celled table unstackable " style={{boxShadow: "0px 0px 10px 3px rgba(0, 0, 0, 0.1)"}}>
//                 <thead>
//                     <tr>
//                         <Table.HeaderCell>Id</Table.HeaderCell>
//                         <Table.HeaderCell>Category</Table.HeaderCell>
//                         <Table.HeaderCell>User Id</Table.HeaderCell>
//                         <Table.HeaderCell>Model</Table.HeaderCell>
//                         <Table.HeaderCell>Serial No</Table.HeaderCell>
//                         <Table.HeaderCell>Date</Table.HeaderCell>

//                         <Table.HeaderCell style={{width:"10%"}} >Comments</Table.HeaderCell>
//                         <Table.HeaderCell style={{width:"10%"}}>Problems</Table.HeaderCell>
//                         <Table.HeaderCell>Download QR</Table.HeaderCell>
//                         <Table.HeaderCell></Table.HeaderCell>
//                         <Table.HeaderCell></Table.HeaderCell>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {tabledata}
//                 </tbody>
//             </table>


//         </div>
//     )}
// export default Table;


import React, { useState } from 'react';
import { Table } from 'semantic-ui-react';
import Pagination from 'react-js-pagination';
import 'semantic-ui-css/semantic.min.css'
import Addcomments from './addcomments';
import Download from './download';
import './style.css';

export default function Table1({ data, addtoform, getData, deletefromtable, downloadQR }) {
    console.log("pag",data);
    //  data.sort((a,b)=>(a.date>b.date)?-1:1)
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 3;

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    }

    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const TableRows = currentItems.map((item, index) => (

        <Table.Row key={index}>
            <Table.Cell>{item.id}</Table.Cell>
            <Table.Cell>{item.category}</Table.Cell>
            <Table.Cell>{item.userid}</Table.Cell>
            <Table.Cell>{item.model}</Table.Cell>
            <Table.Cell>{item.serial}</Table.Cell>
            <Table.Cell>{item.date}</Table.Cell>
            <Table.Cell ><div style={{maxHeight:"100px", overflowY:"scroll"}}>{item.comments}</div></Table.Cell>
            <Table.Cell><div style={{maxHeight:"100px", overflowY:"scroll"}}>{item.problems}</div></Table.Cell>
            <Table.Cell><button onClick={() => downloadQR(item)} className="ui lightGrey button">QR Code</button></Table.Cell>
            <Table.Cell><button onClick={addtoform} className="ui blue button"  >Edit</button></Table.Cell>
            <Table.Cell><button onClick={() => { deletefromtable(item.id) }} className="ui red button">Delete</button></Table.Cell>
        </Table.Row>



    ));

    return (
        <>
            <Download data1={data} />
            <Addcomments data={data} getData={getData} />
            <Table striped className="ui celled table unstackable" id="table">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>User Id</Table.HeaderCell>
                        <Table.HeaderCell>Category</Table.HeaderCell>
                        <Table.HeaderCell>Model</Table.HeaderCell>
                        <Table.HeaderCell>Serial No</Table.HeaderCell>                        
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell style={{ width: "15%"}} >Comments</Table.HeaderCell>
                        <Table.HeaderCell style={{ width: "15%" }}>Problems</Table.HeaderCell>
                        <Table.HeaderCell>Download QR</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>

                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {TableRows}
                </Table.Body>
            </Table>
            <Pagination
                activePage={activePage}
                itemsCountPerPage={itemsPerPage}
                totalItemsCount={data.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
            />
        </>
    );
}
