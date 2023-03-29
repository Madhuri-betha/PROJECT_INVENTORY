import React, { useState, useEffect } from 'react'
import './style.css'
import Table from './table'
import axios from 'axios';
import { Dropdown, Button } from 'semantic-ui-react';
import Cookies from 'universal-cookie';
import QRCode from 'qrcode';
import { useDispatch, useSelector } from 'react-redux';
import { setGlobalCategory, setGlobalDate, setGlobalFlagRedux, setGlobalId, setGlobalModel, setGlobalSerial, setGlobalUserId } from '../reducers/globalStates';


export default function Search() {

  const dispatcher = useDispatch();
  const endpoint = "http://192.168.1.14:9000/"

  const [canvas, setCanvas] = useState(null);
  const [open, setOpen] = useState(false)
  const [deletedRow, setDeletedRow] = useState(true)
  const [id, setId] = useState('')
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [u, setU] = useState("")
  const [categoryData, setCategoryData] = useState([])
  const [options, setOptions] = useState(null)
  const [searchFlag, setSearchFlag] = useState(false)
  const [tableflag, setTableFlag] = useState(false)
  const [searchData, setSearchData] = useState({})

   const cookie = new Cookies();

  let users = [];
  useEffect(() => {
    fetch("https://backflipt-accounts.onrender.com/users")
      .then(response => response.json())
      .then(data => {
        let temp = { key: "", text: "", value: "" }
        console.log(data);
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
    console.log("hh", searchData);
    console.log("hhkkk", data);
    searchData.category = localStorage.getItem("category")
    searchData.userid = localStorage.getItem("userid")
    searchData.model = localStorage.getItem("model")
    var temp = data;
    if (Object.keys(searchData).length === 0) {
      setTableFlag(false);
      setSearchFlag(!searchFlag);
    }
    else {
      console.log("else", searchData);
      setTableFlag(true);
      console.log(data);
      for (let key in searchData) {
        if (searchData[key] === "" || searchData[key] === null) {
          delete searchData[key];
        }
      }
      console.log("null", searchData);
      for (var keyy in searchData) {
        console.log(searchData[keyy]);
        temp = temp.filter((row) => row[keyy] === searchData[keyy])
      }
      setFilteredData(temp)
      console.log(temp)
    }
  }

  //SEARCH SUBMIT
  console.log(filteredData);
  const handleSearch = (e) => {
    var category = e.target.parentElement.searchcategory.value;
    if (category !== "") {
      localStorage.setItem("category", category)
      searchData.category = localStorage.getItem("category")
    }

    var userid = u;
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
    console.log("fg", searchData);

    Object.keys(searchData).forEach((ele) => {
      cookie.set(ele, searchData[ele])
    })
    print();
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
    setU('')
    e.target.parentElement.searchmodel.value = ""
    e.target.parentElement.searchserial.value = ""
    e.target.parentElement.searchdate.value = ""
  }
  var categories = categoryData.map((item, index) => (
    <option key={index} value={item.category}>{item.category}</option>)
  )
 
  //GLOBAL SEARCH
  const handleSearchQueryChange = (event) => {
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

    <div style={{ marginTop: "5%" }}>

      <div style={{ marginLeft: "180px" }}>
        <div style={{display:"flex"}}>
        <h3 className="searchhead" style={{ marginBottom: "0%" }}>categorized search</h3>
        </div>
        <form className="ui equal width form" id="searchform" >
          <label htmlFor="searchcategory">Category:</label>
          <select id="searchcategory">
            <option value="" >Select Category</option>
            {categories}
          </select>

          <label htmlFor="searchuserid">User Id</label>
          <Dropdown style={{ width: "100%" }}
            search
            selection
            id="searchuserid"
            options={options}
            placeholder='Select user'
            value={u}
            onChange={(e) => {
              console.log(e.target.innerText);
              setU(e.target.innerText)
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

      {/* <h6>Global search</h6> */}
      <div style={{ float: "left", marginTop: "-2%", marginBottom: "2%", paddingLeft: "3%", }}>
       <h3 className='globalsearchhead'>Global Search</h3>
        <div className="ui search" >
          <div className="ui icon input">
            <input className="prompt" type="text" placeholder="Search" value={searchQuery}
              onChange={handleSearchQueryChange} style={{ width: "200px", boxShadow: "0px 0px 10px 5px rgba(0, 0, 0, 0.1)" }} />
            <i className="search icon"></i>
          </div>
        </div>
      </div>

      {tableflag && <Table data={filteredData} addtoform={addtoform} deletefromtable={deleteFromTable} downloadQR={downloadQR} />}

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

    </div>

  )
}
