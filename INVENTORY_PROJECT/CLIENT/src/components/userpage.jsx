import React from 'react'
import { useState, useEffect } from 'react'
import { Search,Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import Cookies from "universal-cookie";
export default function Userpage() {

    const cookie = new Cookies()
    const user = cookie.get('username')
    const [data, setData] = useState([])
    const [problems, setProb] = useState("")
    const [id, setID] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [description, setDescription] = useState("")
    const [descriptionFlag, setDescriptionFlag] = useState(false)
    var endpoint = "http://192.168.1.14:9000/"

    //GLOBAL SEARCH
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value)
    }
    const filteredData = data.filter((row) => {
        return Object.values(row).some((value) => {
            if (value!="")
                return value.toLowerCase().includes(searchQuery.toLowerCase())
            return false 
        })
    });
   

    const getData = () => {
        axios.get(endpoint + "getdata")
            .then(response => {
                console.log(response);
                var b = []
                response.data.forEach((obj) => {
                    if (obj.userid == user) {
                        b.push({ ...obj })
                    } 
                })
                setData(b)
            })
    }


    useEffect(getData, [])

    useEffect(() => {
        const newData = { id, problems }
        if (newData["problems"] !== "") {
            console.log(newData)
            axios.post(endpoint + "problem", newData, {
                headers: {
                    "Content-type": "application/json"
                }
            });
        }

    }, [problems,id])

   //PROBLEMS SUBMIT
    const handleSubmit = (event,id,index) => {
        event.preventDefault();
        setID(id);     
        let temp2 = event.target.parentElement.parentElement.childNodes[6].childNodes[0].value;
        event.target.parentElement.parentElement.childNodes[6].childNodes[0].value = ""
        setProb(temp2)
   }


    var tabledata = filteredData.map((item, index) => (
        <tr key={index}>
            <td>{item.id}</td>
            <td className='category' onClick={()=>{setDescription(item.description);setDescriptionFlag(true)}}>{item.category}</td>
            <td>{item.userid}</td>
            <td>{item.model}</td>
            <td>{item.serial}</td>
            <td>{item.date}</td>
            <td className="ui focus input"><input type="text" name="problems"/></td>
            <td><button type="submit"  className="ui green button" onClick={(e)=>{handleSubmit(e,item.id)}}>Submit</button></td>
        </tr>
    ))
    //FORM DESCRIPTION
    var descriptionarray=description.split(",")
    var des=descriptionarray.map(ele=>{
        return <li>{ele}</li>
    })


    return (
        <div style={{ margin: "2%", marginTop: "7%" }}>
            <div className="ui search" style={{ margin: "10px", float: "right" }}>
                <div className="ui icon input">
                    <input className="prompt" type="text" placeholder="Search" value={searchQuery}
                        onChange={handleSearchQueryChange} style={{ boxShadow: "0px 0px 10px 5px rgba(0, 0, 0, 0.1)" }} />
                    <i className="search icon"></i>
                </div>
            </div>
            <table className="ui celled table unstackable" style={{ boxShadow: "0px 0px 10px 5px rgba(0, 0, 0, 0.1)" }}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Category</th>
                        <th>User Name</th>
                        <th>Model</th>
                        <th>Serial No</th>
                        <th>Date</th>
                        <th>Problems</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tabledata}
                </tbody>
            </table>

            <div className={descriptionFlag ? "overlay active" : "overlay"}>
                {
                    <div className="more-details">
                        <ul>
                        {des}
                        </ul>
                        <Button color='green' onClick={() => { setDescriptionFlag(false) }} style={{ marginTop: "2%", float: "right" }}>Ok</Button>
                    </div>
                }
            </div>
             {/* <footer className='footer'>&copy; Copyright 2023 Madhuri</footer> */}

        </div>
    )
}
