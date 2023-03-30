import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Table from "./table"
import { Dropdown, Button } from 'semantic-ui-react';
import QRCode from 'qrcode';
import Papa from 'papaparse'
import './style.css'
import 'semantic-ui-css/semantic.min.css'
import { useSelector } from 'react-redux';

function Adminadd() {

  const c = useSelector((store) => store.globalStates)

  var endpoint = "http://192.168.1.36:9000/"

  const [data, setData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [filteredData, setFilteredData] = useState([])

  const [newCategoryFlag, setNewCategoryFlag] = useState(false)
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
  const [description, setDescription] = useState("")


  const [deletedRow, setDeletedRow] = useState(true)
  const [canvas, setCanvas] = useState(null);
  const [csvData, setCsvData] = useState([])
  const [flag, setFlag] = useState(true)
  const [submittedMsg, setSubmittedMsg] = useState(false)
  const [open, setOpen] = useState(false)
  const [userNameOptions, setUserNameOptions] = useState(null)
  const [categoryDisabled, setCategoryDisabled] = useState(false)
  const [addFileFlag, setAddFileFlag] = useState(false)



  //FETCHING USERS FROM API
  let users = [];
  useEffect(() => {
    fetch("https://backflipt-accounts.onrender.com/users")
      .then(response => response.json())
      .then(usersdata => {
        let temp = { key: "", text: "", value: "" }
        console.log(usersdata);
        usersdata.forEach(obj => {
          temp.key = obj.username;
          temp.text = obj.username;
          temp.value = obj.username;
          users.push({ ...temp });
        });
        setUserNameOptions(users);
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



  // FORM CATEGORY DISPLAY
  const handleCategoryChange = event => {
    console.log(event.target.value);
    if (event.target.value === "other") {
      setCategory(event.target.value);
      console.log("sss");
      setNewCategoryFlag(true);
    }
    else {
      console.log("asdc");
      setCategory(event.target.value);
      setNewCategoryFlag(false)
    }
  }


  //ADDING CATEGORIES TO FORM
  var categories ="";



    function handle() {
      
      const newData = { id, category, newcategory, userid, model, serial, date, comments, problems, description }
      axios.post(endpoint + "inventory", newData, {
        headers: {
          "Content-type": "application/json"
        }
      })
        .then(() => {
          getData();

        });
      setCategory('');
      setUserId('')
      setId('')
      setNewCategory('')
      setModel('')
      setSerial('')
      setDate('')
      setDescription('')
      setToggle(prev => !prev);
      setCategoryDisabled(false)
      setNewCategoryFlag(false)
      setSubmittedMsg(false)
    }


  //FORM SUBMISSION
  const handleSubmit = event => {
    event.preventDefault();
    document.getElementById("newform").style.backgroundColor = "rgb(252 252 210)";
    setSubmittedMsg(true);

  }


  //ADD TO FORM
  function scrollToTop() {
    window.scrollTo({
      top: 53,
      behavior: 'smooth'
    });
    document.getElementById("newform").style.backgroundColor = "#F0FFFF";
  }

  //ONCLICK EDIT BUTTON MOVE TO HOME ROUTE AND SETTING FORM DATA
  useEffect(() => {
    if (c.flagredux) {
      // console.log(c);
      addtoform(c.id, c.category, c.userid, c.model, c.serial, c.date, c.description)
    }
  }, [c.flagredux])

  function addtoform(id, category, userid, model, serial, date, description) {
    console.log(c.flagredux);
    console.log("MADHURI");
    console.log(userid);
    scrollToTop();
    setId(id)
    setCategory(category);
    setUserId(userid)
    setModel(model)
    setSerial(serial)
    var datefromtable = date;
    var parts = datefromtable.split("-")
    var datetoform = parts[2] + "-" + parts[1] + "-" + parts[0]
    setDate(datetoform);
    setDescription(description)
    setCategoryDisabled(true)
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


  function deleteFromTable(delId) {
    console.log(delId);
    setId(delId)
    setOpen(true)
  }



  var file = "";

  //UPLOADING FILE
  function handleFileUpload(event) {
    event.target.style.color = "blue"
    console.log(event.target.files);
    file = event.target.files[0];
    console.log(file);
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        results.data.pop()
        setCsvData(results.data);
      }
    });
  }

  //ON CLICK ADD BUTTON OF A FILE

  function uploadToBackend() {
    console.log(addFileFlag);
    console.log("posted data", csvData)
    if (Object.values(csvData).length == 0) {
      setAddFileFlag(true);
      setAddFileFlag("Please add file");
    }
    else {
      var keysArray = Object.keys(csvData[0]);
      if (keysArray[0] === "category" && keysArray[1] === "userid" && keysArray[2] === "model" && keysArray[3] === "serial" && keysArray[4] === "date") {

        var isEmpty = [];
        isEmpty = csvData.filter(obj => {
          return Object.values(obj).some(val => val === "");
        });
        console.log(isEmpty);
        if (isEmpty.length > 0) {
          setAddFileFlag("fields must not be empty")
        }

        else {
          var found = false;
          data.forEach(obj1 => {
            var match = csvData.some(obj => { if (obj.serial === obj1.serial) return true; else return false })
            if (match) {
              found = true; return;
            }
          })
          console.log(found);
          if (found == false) {
            axios.post(endpoint + "upload", csvData, {
              headers: { 'Content-Type': 'application/json' }
            })
            setFlag(prevState => !prevState)
            setAddFileFlag("successfully added");

          }
          else {
            setAddFileFlag("serial number must not be duplicate")
          }
        }
      }
      else {
        setAddFileFlag("please specify headers in same order [category,userid,model,serial,date]")
      }
    }
    document.getElementById("file").value = "";
    document.getElementById("file").style.color = "black";
    setCsvData([])
  }


  //DOWNLOAD QR
  const downloadQR = (item) => {

    var keysToDelete = ["_id", "comments", "problems", "model", "date", "description", "updatedAt", "createdAt"]
    keysToDelete.forEach(ele => {
      delete item[ele]
    })
    QRCode.toCanvas(canvas, JSON.stringify(item), { scale: 10 })
      .then(canvas => {
        // setCanvas(canvas);
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


  //MODAL ONCLICK OUTSIDE DISAPPEARS
  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.closest('.more-details') === null) {
        setOpen(false);
        setSubmittedMsg(false); setAddFileFlag(false);
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);



  return (
    <div style={{ marginTop: "5%" }}>
      <h2 className="head">Inventory Management System</h2>
      <div style={{ backgroundColor: "rgb(252 252 210)", padding: "2%" }}>

        <div className="form-container">
          <div style={{ display: "flex", flexDirection: "column", width: "30%" }}>
            <center><h3>Add Inventory here</h3></center>

            <form onSubmit={handleSubmit} className="ui equal width form" id="newform" >

              <label htmlFor="category">Category:</label>
              <select id="category" onChange={handleCategoryChange} value={category} required disabled={categoryDisabled} >
                <option value="">Select Category</option>
                <option value="other">other</option>
                {categoryData.map((item, index) => (
                <option key={index} value={item.category}>{item.category}</option>
                  ))}
              </select>

              {newCategoryFlag && <><label htmlFor="newcategory" id="newcategorytext" >Add new category:</label>
                <input
                  type="text"
                  placeholder="enter new category"
                  id="newcategorybar"
                  onChange={(e) => { setNewCategory(e.target.value) }}
                  value={newcategory} pattern=".*\S.*" title="This field is required"
                /></>}

              <label htmlFor="userid">User Name:</label>
              <Dropdown style={{ width: "100%" }}
                search
                selection
                id="userid"
                options={userNameOptions}
                placeholder='Select User'
                value={userid}
                onChange={(event, options) => { setUserId(options.value); }} required
              />

              <label htmlFor="model">Model:</label>
              <input
                type="text"
                placeholder='enter model'
                onChange={(e) => { setModel(e.target.value) }}
                value={model} required pattern=".*\S.*" title="This field is required"
              />
              <label htmlFor="serial">Serial No:</label>
              <input
                type="text"
                placeholder='enter serial'
                onChange={(e) => { setSerial(e.target.value) }}
                value={serial} required pattern=".*\S.*" title="This field is required"
              />
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                placeholder="DD-MM-YYYY"
                onChange={(e) => { setDate(e.target.value); }}
                value={date} required pattern=".*\S.*" title="This field is required"
              />
              <label htmlFor="description">Specifications:</label>
              <textarea
                id="specifications"
                type="text"
                placeholder="please add specifications in comma separated"
                onChange={(e) => { setDescription(e.target.value); }}
                value={description} rows="1" pattern=".*\S.*" title="This field is required"
              />
              <button type="submit" className="ui green button" style={{ margin: "10px", float: "right" }}>Submit</button>
            </form>

            {/* FORM SUBMISSION MODAL DISPLAY  */}

            <div className={submittedMsg ? "overlay active" : "overlay"}>
              {
                <div className="more-details">would you like to add the data
                  <hr style={{ border: "1px black solid", width: "100%" }} />
                  <span>
                    <Button color='green' style={{ marginTop: "2%" }} onClick={handle}>Ok</Button>
                    <Button color='red' onClick={() => {
                      setSubmittedMsg(false); setCategory('');
                      setUserId('')
                      setId('')
                      setNewCategory('')
                      setModel('')
                      setSerial('')
                      setDate('')
                      setDescription('')
                      document.getElementById("newform").style.color = "rgb(252 252 210)"
                    }}>Cancel</Button>
                  </span>
                </div>

              }
            </div>

            {/* FILE UPLOAD  */}
            <div className='file'>
              <input id="file" required type="file" onChange={handleFileUpload} accept=".csv" />
              <button onClick={uploadToBackend} className="fileaddbtn">Add</button>
              <div className={addFileFlag ? "overlay active" : "overlay"}>
                {
                  <div className="more-details">{addFileFlag}
                    <Button color='green' onClick={() => { setAddFileFlag(false) }} style={{ marginTop: "2%", float: "right" }}>Ok</Button>
                  </div>
                }
              </div>
            </div>

          </div>
        </div>


        <Table data={filteredData} addtoform={addtoform} deletefromtable={deleteFromTable} getData={getData} downloadQR={downloadQR} />
        {/* <canvas ref={setCanvas} style={{ display: 'none' }} /> */} 
        <hr />
        <footer style={{ textAlign: "center" }}>&copy; Copyright 2023 Madhuri</footer>


        {/* ON CLICKING DELETE BUTTON WINDOWS OPENS */}
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
    </div>
  )
}
export default Adminadd;