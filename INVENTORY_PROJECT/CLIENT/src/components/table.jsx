
import React,{useEffect, useState} from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Menu } from 'semantic-ui-react';
import './style.css'
import Addcoments from './addcoments';
import Download from './download';
const Table = ({ data, addtoform, getData, deletefromtable }) => {
   
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
            <td><button onClick={addtoform} class="ui blue button"  Scroll to Top>Edit</button></td>
            <td><button onClick={deletefromtable} class="ui red button">Delete</button></td>
        </tr>
    ))

    return (

        <div >
             <Download data1={data} />
             <Addcoments data={data} getData={getData} />
           
            <table class="ui celled table unstackable" style={{boxShadow: "0px 0px 10px 3px rgba(0, 0, 0, 0.1)"}}>
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
