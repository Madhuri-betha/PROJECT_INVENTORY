import React, { useEffect, useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import Table from "./table"
import { Dropdown } from 'semantic-ui-react';
import { Menu } from 'semantic-ui-react';
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Search, Dropdown } from 'semantic-ui-react';
import Papa from 'papaparse'
function Adminadd() {
  var endpoint="http://192.168.1.14:9000/"
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


  const [options, setOptions] = useState(null)
  const [selectedValue, setSelectedValue] = useState(null);
  let users = [];
  useEffect(() => {
    fetch("https://backflipt-accounts.onrender.com/users")
      .then(response => response.json())
      .then(data => {
        let temp = {
          key: "",
          text: "",
          value: ""
        }
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
  // console.log(users);

  const handleSearchChange = (e, data) => {
    setUserId(data.value);
  };

  //FETCHING DATABASE DATA
  const getData = () => {
    fetch(endpoint+"getdata")
      .then(res => res.json())
      .then(data => {
        setData(data)
        setFilteredData(data)
      })
  }

  //FETCHING CATEGORIES
  const getCategory = () => {
    fetch(endpoint+"idgen")
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
  //FORM SUBMISSION
  const handleSubmit = event => {
    event.preventDefault();

    document.getElementById("newform").style.backgroundColor = "#fefeea";
    const newData = { id, category, newcategory, userid, model, serial, date, comments, problems };
    axios.post(endpoint+"inventory", newData, {
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
    axios.post(endpoint+"delete", { id: id }, {
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

  function deleteFromTable(e) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      console.log(e.target.parentElement.parentElement.childNodes[0].innerHTML)
      setId(e.target.parentElement.parentElement.childNodes[0].innerHTML);
      setDeletedRow(false)
    }
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
    event.target.style.color="red"
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true, 
      complete: (results) => {
        results.data.pop()
        setCsvData(results.data);
      }
    });
  }


  function uploadToBackend() {
    console.log("posted data", csvData)
    var keysArray=Object.keys(csvData[0]);
    if(keysArray[0]==="category" && keysArray[1]==="userid" && keysArray[2]==="model" && keysArray[3]==="serial" && keysArray[4]==="date" )
    {
    axios.post(endpoint+"upload", csvData, {
      headers: { 'Content-Type': 'application/json' }
    })
    setFlag(prevState => !prevState)

    document.getElementById("file").value="";
    document.getElementById("file").style.color="black";
  }
  else{
    alert("please specify headers as [category,userid,model,serial,date]");
  }
  document.getElementById("file").value="";
  document.getElementById("file").style.color="black";
  }


  return (
    <>
    <h2 className="head">Inventory Management System</h2> 
    <div style={{ backgroundColor: "#fefeea",margin:"0 3% 3% 3%",padding:"2%" }}>
      <div className="form-container">
        <form class="ui equal width form" id="newform" style={{ marginLeft: "30px", padding: "1%", width: "30%", float: "left",boxShadow:"0px 0px 10px 5px rgba(0, 0, 0, 0.1)",borderRadius: "3px" }}>

          <label fluid htmlFor="category">Category:</label>
          <select id="category" onChange={handleCategoryChange} value={category} >
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
            name="newcategory"
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
            onChange={handleSearchChange}
          />

          <label htmlFor="model">Model:</label>
          <input
            type="text"
            name="model"
            id="model"
            placeholder='enter model'
            onChange={handleModelChange}
            value={model}
          />
          <label htmlFor="serial">Serial No:</label>
          <input
            type="text"
            name="serial"
            id="serial"
            placeholder='enter serial'
            onChange={handleSerialChange}
            value={serial}
          />
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            placeholder="DD-MM-YYYY"
            onChange={handleDateChange}
            value={date}
          />
          <button type="button" onClick={handleSubmit} class="ui green button" style={{ margin: "10px",float:"right"}}>Submit</button>
        </form>

        {/* SEARCH FORM  */}
        <form class="ui equal width form" style={{ marginLeft: "50px", width: "30%", float: "right", padding: "1%", boxShadow: "0px 0px 10px 5px rgba(0, 0, 0, 0.1)", marginRight: "20px",borderRadius: "3px"  }}>

          <label fluid htmlFor="category">Category:</label>
          <select id="category">
            <option value="" >Select Category</option>
            {categories}
          </select>
          
            <label fluid htmlFor="userid">User Id</label>
            <Dropdown style={{width:"100%"}}
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
          <button type="button" onClick={handleSearch} class="ui yellow button" style={{ margin: "10px",float:"right" }}>Search</button>
          <button type="button" onClick={handleReset} class="ui yellow button" style={{ margin: "10px",float:"left" }}>Reset</button>
        </form>
      </div>

      <div className='file'>
  
        <input id="file" required type="file" onChange={handleFileUpload} accept=".csv" />
        <button onClick={uploadToBackend} className="fileaddbtn">Add</button>
      </div>
    

      <div class="ui search" style={{ float: "left",marginTop:"7%",marginRight:"10%",paddingLeft:"3%",}}>
        <div class="ui icon input">
          <input class="prompt" type="text" placeholder="Search" value={searchQuery}
            onChange={handleSearchQueryChange}  style={{width: "200px",boxShadow: "0px 0px 10px 5px rgba(0, 0, 0, 0.1)"}}/>
          <i class="search icon"></i>
        </div>
      </div>
 

      <Table data={filteredData} addtoform={addtoform} deletefromtable={deleteFromTable} getData={getData} />
      <hr />
      <footer style={{ margin: "20px", textAlign:"center" }}>&copy; Copyright 2023 Madhuri</footer>
    </div>
    </>
  )
}
export default Adminadd;