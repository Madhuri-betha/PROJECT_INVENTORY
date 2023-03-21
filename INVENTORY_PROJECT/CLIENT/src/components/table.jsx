
import React,{useEffect, useState} from 'react'
import 'semantic-ui-css/semantic.min.css'
import './style.css'
import Addcomments from './addcomments';
import Download from './download';
const Table = ({ data, addtoform, getData, deletefromtable,downloadQR  }) => {
   
   const tabledata = data.map((item, index) => (
        <tr key={index}>
            <td>{item.id}</td>
            <td>{item.category}</td>
            <td>{item.userid}</td>
            <td>{item.model}</td>
            <td>{item.serial}</td>
            <td>{item.date}</td>
            <td>{item.comments}</td>
            <td>{item.problems}</td>
            <td><button onClick={() => downloadQR(item)} className="ui lightGrey button">QR Code</button></td>
            <td><button onClick={addtoform} className="ui blue button"  >Edit</button></td>
            <td><button onClick={()=>{deletefromtable(item.id)}} className="ui red button">Delete</button></td>

        </tr>
    ))

    return (

        <div >
             <Download data1={data} />
             <Addcomments data={data} getData={getData} />
           
            <table className="ui celled table unstackable" style={{boxShadow: "0px 0px 10px 3px rgba(0, 0, 0, 0.1)"}}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Category</th>
                        <th>User Id</th>
                        <th>Model</th>
                        <th>Serial No</th>
                        <th>Date</th>
                        
                        <th style={{width:"10%"}}>Comments</th>
                        <th style={{width:"10%"}}>Problems</th>
                        <th>QR</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tabledata}
                </tbody>
            </table>
        </div>
    )}
export default Table;
