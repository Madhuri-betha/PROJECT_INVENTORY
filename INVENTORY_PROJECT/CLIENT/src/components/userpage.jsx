import React from 'react'
import { useState, useEffect } from 'react'
import { Search } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import Cookies from "universal-cookie";
export default function Userpage() {

    const cookie = new Cookies()
    const user = cookie.get('username')
    const [data, setData] = useState([])
    const [problems, setProb] = useState("")
    const [id, setID] = useState("")
    const [problem, setProblem] = useState('')
    const [searchQuery, setSearchQuery] = useState("")
    var endpoint="http://192.168.1.14:9000/"

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value)
    }
    const filteredData = data.filter((row) => {
        return Object.values(row).some((value) => {
            if (isNaN(value))
                return value.toLowerCase().includes(searchQuery.toLowerCase())
            return false
        })
    });

    const getData = () => {
        fetch(endpoint+"getdata")
            .then(res => res.json())
            .then(data => {
                var b = []
                data.forEach((obj) => {
                    if (obj.userid == user) {
                        b.push({ ...obj })
                    }
                })
                setData(b)
            })}


    useEffect(getData, [])

    useEffect(() => {
        const newData = { id, problems }
        if (newData["problems"] !== "") {
            console.log(newData)
            axios.post(endpoint+"problem", newData, {
                headers: {
                    "Content-type": "application/json"
                }
            });
        }

    }, [problems, id])


    let temp2;
    const handleSubmit = event => {
        event.preventDefault();
        let temp = event.target.parentElement.parentElement.childNodes[0].innerHTML
        setID(temp);
        let temp2 = event.target.parentElement.parentElement.childNodes[6].childNodes[0].value;
        event.target.parentElement.parentElement.childNodes[6].childNodes[0].value = ""
        setProb(temp2)


    }


    var tabledata = filteredData.map((item, index) => (
        <tr key={index}>
            <td>{item.id}</td>
            <td>{item.category}</td>
            <td>{item.userid}</td>
            <td>{item.model}</td>
            <td>{item.serial}</td>
            <td>{item.date}</td>
            <td className="ui focus input"><input type="text" name="problems" /></td>
            <td><button type="submit" className="ui green button" onClick={handleSubmit}>Submit</button></td>

        </tr>
    ))



    return (
        <div style={{ margin: "2%" }}>
            <h2 style={{ float: "right", alignItems: "center", marginTop: "1.2%", marginRight: "3%" }}>{user}</h2>
            <div className="ui search" style={{ margin: "10px", float: "right" }}>
                <div className="ui icon input">
                    <input className="prompt" type="text" placeholder="Search" value={searchQuery}
                        onChange={handleSearchQueryChange} />
                    <i className="search icon"></i>
                </div>
            </div>
            <table className="ui celled table unstackable" style={{ boxShadow: "0px 0px 10px 5px rgba(0, 0, 0, 0.1)" }}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Category</th>
                        <th>User Id</th>
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
            <hr />
            <footer style={{ textAlign: "center" }}>&copy; Copyright 2023 Madhuri</footer>

        </div>
    )
}
