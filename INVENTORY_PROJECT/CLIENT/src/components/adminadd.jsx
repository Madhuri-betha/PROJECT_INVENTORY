import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Table from "./table"
import { Dropdown, Button } from 'semantic-ui-react';
import QRCode from 'qrcode';
import Papa from 'papaparse'
import './style.css'
import 'semantic-ui-css/semantic.min.css'


function Adminadd() {
  var endpoint = "http://192.168.1.14:9000/"
  const [canvas, setCanvas] = useState(null);
  const [data, setData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [category, setCategory] = useState("")
  const [userid, setUserId] = useState(null)
  const [newcategory, setNewCategory] = useState("")
  const [model, setModel] = useState("")
  const [serial, setSerial] = useState("")
  const [date, setDate] = useState("")
  const [toggle, setToggle] = useState(true)
  const [comments, setComments] = useState("")
  const [problems, setProblems] = useState("")
  const [id, setId] = useState("")
  const [deletedRow, setDeletedRow] = useState(true)
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([])
  const [csvData, setCsvData] = useState([])
  const [flag, setFlag] = useState(true)
  const [u, setU] = useState("")
  const [submittedMsg, setSubmittedMsg] = useState(false)
  const [open, setOpen] = useState(false)
  const [opent, setOpent] = useState(false)
  const [options, setOptions] = useState(null)
  const [duplicateMsg, setDuplicateMsg] = useState("");


  //FETCHING USERS FROM API
  let users = [];
  useEffect(() => {
    fetch("https://backflipt-accounts.onrender.com/users")
      .then(response => response.json())
      .then(data => {
        let temp = {key: "",text: "",value: ""}
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



  //FETCHING DATABASE DATA
  const getData = () => {
    fetch(endpoint + "getdata")
      .then(res => res.json())
      .then(data => {
        setData(data)
        setFilteredData(data)
      })
  }

  //FETCHING USER ENTERED CATEGORIES 
  const getCategory = () => {
    fetch(endpoint + "idgen")
      .then(res => res.json())
      .then(categoryData => {
        setCategoryData(categoryData)
      })
  }


  useEffect(() => {
    getData();
    getCategory();
  }, [toggle, deletedRow, flag])

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

  // FORM CATEGORY DISPLAY
  const handleCategoryChange = event => {
    if (event.target.value === "other") {
      setCategory(event.target.value);
      document.getElementById("newcategorytext").style.display = "block";
      document.getElementById("newcategorybar").style.display = "block";
    }
    else {
      document.getElementById("newcategorytext").style.display = "none";
      document.getElementById("newcategorybar").style.display = "none";
      setCategory(event.target.value);
    };
  }

  //ADDING CATEGORIES TO FORM
  var categories = categoryData.map((item, index) => (
    <option key={index} value={item.category}>{item.category}</option>)
  )
  //SETTING FORM VALUES
  const handleNewCategoryChange = event => {
    setNewCategory(event.target.value);
  };
  const handleUserIdChange = event => {
    console.log(event.target.value);
    setUserId(event.target.value);
  };
  const handleModelChange = event => {
    setModel(event.target.value);
  };
  const handleSerialChange = event => {
    setSerial(event.target.value);
  };
  const handleDateChange = event => {
    setDate(event.target.value);
  };
  const handleSearchChange = (e, data) => {
    setUserId(data.value);
  };


  useEffect(() => {
    setTimeout(() => {
      setSubmittedMsg(false)
    }, 3000);
  }, [submittedMsg])

  //FORM SUBMISSION
  const handleSubmit = event => {
    event.preventDefault();

    document.getElementById("newform").style.backgroundColor = "#fefeea";
    const newData = { id, category, newcategory, userid, model, serial, date, comments, problems };
    axios.post(endpoint + "inventory", newData, {
      headers: {
        "Content-type": "application/json"
      }
    }).then(() => {
      getData();
    });
    setCategory('')
    setUserId('')
    setNewCategory('')
    setModel('')
    setSerial('')
    setDate('')
    setToggle(prev => !prev)
    setSubmittedMsg(true);
    document.getElementById("newcategorytext").style.display = "none";
    document.getElementById("newcategorybar").style.display = "none";
  };

  //ADD TO FORM
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    document.getElementById("newform").style.backgroundColor = "#F0FFFF";
  }

  function addtoform(e) {
    scrollToTop()
    setId(e.target.parentElement.parentElement.childNodes[0].innerHTML)
    setCategory(e.target.parentElement.parentElement.childNodes[1].innerHTML)
    setUserId(e.target.parentElement.parentElement.childNodes[2].innerHTML)
    setModel(e.target.parentElement.parentElement.childNodes[3].innerHTML)
    setSerial(e.target.parentElement.parentElement.childNodes[4].innerHTML)
    var datefromtable = e.target.parentElement.parentElement.childNodes[5].innerHTML;
    var parts = datefromtable.split("-")
    var datetoform = parts[2] + "-" + parts[1] + "-" + parts[0]
    setDate(datetoform)
  }

  //FOR DELETION
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
      senddata()
    }
  }, [deletedRow])
  var iddelete;
  function deleteFromTable(delId) {
    console.log(delId);
    setId(delId)
    setOpen(true)
  }
  //MULTIPLE SEARCH
  const handleSearch = (e) => {

    var searchData = {}
    var category = e.target.parentElement.category.value;
    if (category !== "")
      searchData.category = category

    var userid = u;
    if (userid !== "")
      searchData.userid = userid

    var model = e.target.parentElement.model.value;
    if (model !== "")
      searchData.model = model

    var serial = e.target.parentElement.serial.value;
    if (serial !== "")
      searchData.serial = serial

    var d = e.target.parentElement.date.value;
    const parts = d.split("-");
    var date = parts[2] + "-" + parts[1] + "-" + parts[0];
    if (date !== "undefined-undefined-")
      searchData.date = date

    var temp = data;
    console.log("fg", searchData);
    console.log("array", data)
    for (var keyy in searchData) {
      temp = temp.filter((row) => row[keyy] === searchData[keyy])
    }

    console.log("temp", temp);
    setFilteredData(temp)
    console.log("search filtered")
  }


  //SEARCH RESET
  const handleReset = (e) => {
    setFilteredData(data)
    e.target.parentElement.category.value = ""
    setU('')
    e.target.parentElement.model.value = ""
    e.target.parentElement.serial.value = ""
    e.target.parentElement.date.value = ""
  }

  function handleFileUpload(event) {
    event.target.style.color = "red"
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        results.data.pop()
        setCsvData(results.data);
      }
    });
  }
  const handleHide = (e) => {

    setOpen(!open);

  };

  function uploadToBackend() {
    var found;
    console.log("posted data", csvData)
    var keysArray = Object.keys(csvData[0]);
    if (keysArray[0] === "category" && keysArray[1] === "userid" && keysArray[2] === "model" && keysArray[3] === "serial" && keysArray[4] === "date") {
      data.forEach(obj1 => {
        found = csvData.some(obj => obj.serial === obj1.serial)
      })
      if (!found) {
        axios.post(endpoint + "upload", csvData, {
          headers: { 'Content-Type': 'application/json' }
        })
        setFlag(prevState => !prevState)

        document.getElementById("file").value = "";
        document.getElementById("file").style.color = "black";
      }
      else {
        // alert("serial number must not be duplicate");
        setOpent(!opent);
        setDuplicateMsg("serial")
      }
    }
    else {
      // alert("please specify headers as [category,userid,model,serial,date]");
      setOpent(!opent);
      setDuplicateMsg("headers")
    }
    document.getElementById("file").value = "";
    document.getElementById("file").style.color = "black";
  }

  const downloadQR = (item) => {
    var keysToDelete = ["_id", "comments", "problems", "category", "model", "date"]
    keysToDelete.forEach(ele => {
      delete item[ele]
    })
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

  return (
    <>
      <h2 className="head">Inventory Management System</h2>
      <div style={{ backgroundColor: "#fefeea", margin: "0 3% 3% 3%", padding: "2%" }}>
        <div className="form-container">

          <form onSubmit={handleSubmit} className="ui equal width form" id="newform" >
            <label htmlFor="category">Category:</label>
            <select id="category" onChange={handleCategoryChange} value={category} required >
              <option value="">Select Category</option>
              <option value="other">other</option>
              {categories}
            </select>
            <label htmlFor="newcategory" id="newcategorytext" style={{ display: "none" }}>Add new category:</label>
            <input
              type="text"
              style={{ display: "none" }}
              placeholder="enter new category"
              id="newcategorybar"
              // name="newcategory"
              onChange={handleNewCategoryChange}
              value={newcategory}
            />

            <label htmlFor="userid">User Id</label>
            <Dropdown style={{ width: "100%" }}
              search
              selection
              id="userid"
              name="userid"
              options={options}
              placeholder='Select user'
              value={userid}
              onChange={handleSearchChange} required
            />

            <label htmlFor="model">Model:</label>
            <input
              type="text"
              // name="model"
              // id="model"
              placeholder='enter model'
              onChange={handleModelChange}
              value={model} required
            />
            <label htmlFor="serial">Serial No:</label>
            <input
              type="text"
              // name="serial"
              // id="serial"
              placeholder='enter serial'
              onChange={handleSerialChange}
              value={serial} required
            />
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              // id="date"
              placeholder="DD-MM-YYYY"
              onChange={handleDateChange}
              value={date} required
            />
            <button type="submit" className="ui green button" style={{ margin: "10px", float: "right" }}>Submit</button>
            {submittedMsg ? <span style={{ color: "red" }}>successsfully submitted</span> : ""}
          </form>

          {/* SEARCH FORM  */}
          <form className="ui equal width form" id="searchform">

            <label htmlFor="category">Category:</label>
            <select id="category">
              <option value="" >Select Category</option>
              {categories}
            </select>

            <label htmlFor="userid">User Id</label>
            <Dropdown style={{ width: "100%" }}
              search
              selection
              id="userid"
              name="userid"
              options={options}
              placeholder='Select user'
              value={u}
              onChange={(e) => {
                console.log(e.target.innerText);
                setU(e.target.innerText)
              }}
            />

            <label htmlFor="model">Model:</label>
            <input
              type="text"
              name="model"
              id="model"
              placeholder='enter model'
            />
            <label htmlFor="serial">Serial No:</label>
            <input
              type="text"
              name="serial"
              id="serial"
              placeholder='enter serial'
            />
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              placeholder="DD-MM-YYYY"
            />
            <button type="button" onClick={handleSearch} className="ui yellow button" style={{ margin: "10px", float: "right" }}>Search</button>
            <button type="button" onClick={handleReset} className="ui yellow button" style={{ margin: "10px", float: "left" }}>Reset</button>
          </form>
        </div>

        <div className='file'>

          <input id="file" required type="file" onChange={handleFileUpload} accept=".csv" />
          <button onClick={uploadToBackend} className="fileaddbtn">Add</button>
        </div>


        <div className="ui search" style={{ float: "left", marginTop: "7%", marginRight: "10%", paddingLeft: "3%", }}>
          <div className="ui icon input">
            <input className="prompt" type="text" placeholder="Search" value={searchQuery}
              onChange={handleSearchQueryChange} style={{ width: "200px", boxShadow: "0px 0px 10px 5px rgba(0, 0, 0, 0.1)" }} />
            <i className="search icon"></i>
          </div>
        </div>


        <Table data={filteredData} addtoform={addtoform} deletefromtable={deleteFromTable} getData={getData} downloadQR={downloadQR} />
        <canvas ref={setCanvas} style={{ display: 'none' }} />
        <hr />
        <footer style={{ margin: "20px", textAlign: "center" }}>&copy; Copyright 2023 Madhuri</footer>
      </div>

      {/* ON CLICKING DELETE BUTTON WINDOWS OPENS */}
      <div className={open ? "overlay active" : "overlay"}>
        {
          <div className="more-details">
            <span className="close-button">
              <i className="fa-regular fa-circle-xmark" onClick={handleHide} ></i>
            </span>
            <label> {id} will be deleted</label>
            <span><Button color='green' onClick={() => { setDeletedRow(false); setOpen(false) }}>Ok</Button>
              <Button color='red' onClick={handleHide}>Cancel</Button>
            </span>
          </div>
        }
      </div>

      {/* ON CSV UPLOADING CHECKING FOR SERIAL AND HEADERS  */}
      <div className={opent ? "overlay active" : "overlay"}>
        {
          <div className="more-details">
            <span className="close-button">
              <i className="fa-regular fa-circle-xmark" onClick={handleHide} ></i>
            </span>
            {duplicateMsg}
            <Button color='green' onClick={() => { setOpent(false) }}>Ok</Button>
          </div>
        }
      </div>
    </>
  )
}
export default Adminadd;