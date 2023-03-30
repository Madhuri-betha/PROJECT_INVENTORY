import React, { useState, useEffect } from 'react'
import './style.css'
import Table from './table'
import axios from 'axios';
import { Dropdown, Button } from 'semantic-ui-react';
import Cookies from 'universal-cookie';
import QRCode from 'qrcode';
import { useDispatch } from 'react-redux';
import { setGlobalCategory, setGlobalDate, setGlobalFlagRedux, setGlobalId, setGlobalModel, setGlobalSerial, setGlobalUserId, setGlobalDescription } from '../reducers/globalStates';


export default function Search() {

  const dispatcher = useDispatch();
  const endpoint = "http://192.168.1.36:9000/"

  const [canvas, setCanvas] = useState(null);
  const [open, setOpen] = useState(false)
  const [deletedRow, setDeletedRow] = useState(true)
  const [id, setId] = useState('')
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchUserId, setSearchUserId] = useState("")
  const [categoryData, setCategoryData] = useState([])
  const [options, setOptions] = useState(null)
  const [searchFlag, setSearchFlag] = useState(false)
  const [tableflag, setTableFlag] = useState(false)
  const [searchData, setSearchData] = useState({})

  const cookie = new Cookies();


  //USERS API
  let users = [];
  useEffect(() => {
    fetch("https://backflipt-accounts.onrender.com/users")
      .then(response => response.json())
      .then(data => {
        let temp = { key: "", text: "", value: "" }
        data.forEach(element => {
          temp.key = element.username;
          temp.text = element.username;
          temp.value = element.username;
          users.push({ ...temp });
        });
        setOptions(users);
      })
  }, [])



  useEffect(() => {
    getData();
    getCategory();
  }, [deletedRow])


  //FETCHING DATABASE DATA
  const getData = async () => {
    await fetch(endpoint + "getdata")
      .then(res => res.json())
      .then(data => {
        setData(data)
        setFilteredData(data)
      })
  }

  //FETCHING USER ENTERED CATEGORIES 
  const getCategory = async () => {
    await fetch(endpoint + "idgen")
      .then(res => res.json())
      .then(categoryData => {
        setCategoryData(categoryData)
      })
  }

  //SEARCH FORM DATA TO TABLE
  useEffect(() => {
    print();
    console.log("called");
  }, [data])

  function print() {
    searchData.category = localStorage.getItem("category")
    searchData.userid = localStorage.getItem("userid")
    searchData.model = localStorage.getItem("model")
    var temp = data;
    if (Object.keys(searchData).length === 0) {
      setTableFlag(false);
      setSearchFlag(!searchFlag);
    }
    else {
      setTableFlag(true);
      for (let key in searchData) {
        if (searchData[key] === "" || searchData[key] === null) {
          delete searchData[key];
        }
      }
      for (var keyy in searchData) {
        temp = temp.filter((row) => row[keyy] === searchData[keyy])
      }
      setFilteredData(temp)
    }
  }

  //SEARCH SUBMIT

  const handleSearch = (e) => {
    var category = e.target.parentElement.searchcategory.value;
    if (category !== "") {
      localStorage.setItem("category", category)
      searchData.category = localStorage.getItem("category")
    }

    var userid = searchUserId;
    if (userid !== "") {
      localStorage.setItem("userid", userid)
      searchData.userid = localStorage.getItem("userid")
    }

    var model = e.target.parentElement.searchmodel.value;
    if (model !== "") {
      localStorage.setItem("model", model)
      searchData.model = localStorage.getItem("model")
    }

    var serial = e.target.parentElement.searchserial.value;
    if (serial !== "")
      searchData.serial = serial

    var d = e.target.parentElement.searchdate.value;
    const parts = d.split("-");
    var date = parts[2] + "-" + parts[1] + "-" + parts[0];
    if (date !== "undefined-undefined-")
      searchData.date = date

    print();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }


  //SEARCH RESET
  const handleReset = (e) => {
    localStorage.setItem("category", "")
    localStorage.setItem("userid", "")
    localStorage.setItem("model", "")
    localStorage.setItem("serial", "")
    localStorage.setItem("date", "")

    setFilteredData(data)
    setTableFlag(false);
    e.target.parentElement.searchcategory.value = ""
    setSearchUserId('')
    e.target.parentElement.searchmodel.value = ""
    e.target.parentElement.searchserial.value = ""
    e.target.parentElement.searchdate.value = ""
  }



  //GLOBAL SEARCH
  const handleSearchQueryChange = (event) => {
    setTableFlag(true)
    setSearchQuery(event.target.value);
    var filteredData;
    filteredData = data.filter((row) => {
      return Object.values(row).some((value) => {
        if (isNaN(value))
          return value.toLowerCase().includes((event.target.value).toLowerCase())
        return false
      })
    })
    setFilteredData(filteredData)
  }

  //ONCLICK EDIT BUTTON MOVE TO HOME ROUTE AND SETTING FORM DATA
  function addtoform(id, category, userid, model, serial, date, description) {

    console.log(id, category, userid, model, serial);
    dispatcher(setGlobalCategory(category))
    dispatcher(setGlobalId(id))
    dispatcher(setGlobalUserId(userid))
    dispatcher(setGlobalModel(model))
    dispatcher(setGlobalSerial(serial))
    dispatcher(setGlobalDate(date))
    dispatcher(setGlobalDescription(description))
    dispatcher(setGlobalFlagRedux(true))
  }

  //FROM TABLE COMPONENT ON A CLICK A DELETE BUTTON
  function deleteFromTable(delId) {
    console.log(delId);
    setId(delId)
    setOpen(true)
  }

  function senddata() {
    console.log(id)
    axios.post(endpoint + "delete", { id: id }, {
      headers: {
        "Content-type": "application/json"
      }
    })
    setDeletedRow(true)
  }

  //FOR DELETING A ROW
  useEffect(() => {
    if (deletedRow === false) {
      console.log("DELETE");
      senddata()
    }
  }, [deletedRow])


  //qR DOWNLOAD
  const downloadQR = (item) => {
    var keysToDelete = ["_id", "comments", "problems", "model", "date", "description", "updatedAt", "createdAt"]
    keysToDelete.forEach(ele => {
      delete item[ele]
    })
    console.log(item);
    QRCode.toCanvas(canvas, JSON.stringify(item), { scale: 10 })
      .then(canvas => {
        setCanvas(canvas);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'qrcode.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      })
      .catch(error => {
        console.error(error);
      });
  };

  //MODAL OUTSIDE CLICK DISAPPEARS
  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.closest('.more-details') === null) {
        setOpen(false);
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);


  return (

    <div style={{ marginTop: "5%"}}>

      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <div  style={{ display: "flex", flexDirection: "column", alignItems: "center",width: "30%" }}>
          <h3 className="searchheaders">Categorized Search</h3>
        
        <form className="ui equal width form" id="searchform" >
          <label htmlFor="searchcategory">Category:</label>
          <select id="searchcategory">
            <option value="" >Select Category</option>
            {categoryData.map((item, index) => (
              <option key={index} value={item.category}>{item.category}</option>)
            )}
          </select>

          <label htmlFor="searchuserid">User Id</label>
          <Dropdown style={{ width: "100%" }}
            search
            selection
            id="searchuserid"
            options={options}
            placeholder='Select user'
            value={searchUserId}
            onChange={(e) => {
              console.log(e.target.innerText);
              setSearchUserId(e.target.innerText)
            }}
          />

          <label htmlFor="searchmodel">Model:</label>
          <input
            type="text"
            id="searchmodel"
            placeholder='enter model'
          />
          <label htmlFor="searchserial">Serial No:</label>
          <input
            type="text"
            id="searchserial"
            placeholder='enter serial'
          />
          <label htmlFor="searchdate">Date:</label>
          <input
            type="date"
            id="searchdate"
            placeholder="DD-MM-YYYY"
          />
          <button type="button" onClick={handleSearch} className="ui yellow button" style={{ margin: "10px", float: "right" }}>Search</button>
          <button type="button" onClick={handleReset} className="ui yellow button" style={{ margin: "10px", float: "left" }}>Reset</button>
        </form>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h3 className="searchheaders">Global Search</h3>
        <div className="ui search" >
          <div className="ui icon input">
            <input className="prompt" type="text" placeholder="Search" value={searchQuery}
              onChange={handleSearchQueryChange} style={{ width: "200px", boxShadow: "0px 0px 10px 5px rgba(0, 0, 0, 0.1)" }} />
            <i className="search icon"></i>
          </div>
        </div>
        </div>

    </div>


      {/* MODAL FOR DELETION OF A ROW */}
      <div className={open ? "overlay active" : "overlay"}>
        {
          <div className="more-details">
            <label> {id} will be deleted</label>
            <hr style={{ border: "1px black solid", width: "100%" }} />
            <span>
              <Button color='red' onClick={() => { setDeletedRow(false); setOpen(false) }} style={{ marginTop: "2%" }}>Delete</Button>
              <Button color='blue' onClick={() => { setOpen(!open) }} style={{ marginTop: "2%", float: "right" }}>Cancel</Button>
            </span>
          </div>
        }
      </div>
      {tableflag && <div style={{display:"block",marginLeft:"17px",marginRight:"17px"}}><Table data={filteredData} addtoform={addtoform} getData={getData} deletefromtable={deleteFromTable} downloadQR={downloadQR} /></div>}
   
    </div>

  )
}
