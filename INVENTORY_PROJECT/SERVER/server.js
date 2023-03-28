const express = require('express')
const axios = require('axios')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

//DB CONNECTION
const conn = require('./db/conn.js')
const Inventorydata = require("./db/models/inventorydetails")
const Idgenerate = require("./db/models/Idgenerate.js")

//MIDDLEWARES
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


//PORT
app.listen(9000, () => {
  console.log("server listening at 9000")
})


//HEALTH API
app.get('/health', (req, res) => {
  if (conn.readyState === 1) {
    res.json({ DBstatus: 'UP', ServerStatus: 'Healthy' });
  } else {
    res.status(500).json({ DBstatus: 'DOWN', ServerStatus: 'Healthy' });
  }
});

//INVENTORY DATABASE DATA
app.get('/getdata', (req, res) => {
  var data = Inventorydata.find({}, (err, data) => {
    if (err) { console.log(err); return res.status(500).send('Error fetching data from database');; }
    res.send(data);
  });
})

//IDGENERATE DATABASE DATA
app.get('/idgen', (req, res) => {
  Idgenerate.find({}, (err, data) => {
    if (err) { console.log(err); return }
    res.send(data);
  })
})


//CSV FILE UPLOADING
app.post("/upload", (req, res) => {
  const newData = req.body;
  console.log("vbh",newData);
  if(Object.keys(newData).length > 0)
  {
    console.log("gh");
  newData.map(ele => {
    let idletter = ele.category.substring(0, 2).toUpperCase()
    Idgenerate.findOne({category: ele.category.toLowerCase()}, async (err,data)=>{
      if(data==null){
        const b = new Idgenerate({ category: ele.category, count: 1 })
        await b.save();
      }
      else{
        await Idgenerate.findOneAndUpdate({ category: ele.category.toLowerCase() }, { $inc: { count: 1 } }, { new: true })
      }
      Idgenerate.findOne({category:ele.category},async(err,data)=>{
      let b = idletter + "_" + data.count;
      ele["id"] = b;
      console.log(ele);
      let createData = new Inventorydata(ele)
      console.log(createData)
      await createData.save();
      })
    })
  })
}
  res.send("new data added")
})

//FORM SUBMISSION 
app.post('/inventory', (req, res) => {
  let idata = req.body
  const dateString = req.body.date; // YYYY-MM-DD format
  const parts = dateString.split("-");
  req.body.date = parts[2] + "-" + parts[1] + "-" + parts[0];
  console.log(req.body.date)
  if (idata.id && idata.id != "") {
    Inventorydata.findOneAndUpdate({ id: req.body.id }, req.body, { new: true }, (err, data2) => {
      console.log(data2);
    })
  }
  else {
    var data1;
    if (req.body.category === "other") {
      req.body.category = req.body.newcategory
      delete req.body.newcategory;
      var b = Idgenerate({ category: req.body.category, count: 1 })
      b.save();
      var idletter = req.body.category.substring(0, 2).toUpperCase()
      req.body.id = idletter + "_" + 1;
      data1 = new Inventorydata(idata);
      data1.save();
    }
    else {
      console.log("3")
      var idletter = req.body.category.substring(0, 2).toUpperCase()
      Idgenerate.findOneAndUpdate({ category: req.body.category }, { $inc: { count: 1 } }, { new: true}, (err, data) => {
        console.log("fgvbh", data);
        Idgenerate.findOne({ category: req.body.category }, (err, data) => { 
          idata.id = idletter + "_" + data.count;
          data1 = new Inventorydata(idata,{ordered:false});
          data1.save();

        })
      })
    }
  }
  res.send("data added")
})



//DELETING TABLE ROW
app.post('/delete', (req, res) => {
  console.log("delete")
  console.log(req.body)
  Inventorydata.findOneAndDelete({ id: req.body.id }, (err, data) => {
    if (err) console.log(err)
    else console.log(data)
  })
  res.send("data deleted");
});



//POSTING COMMENTS
app.post('/comment', (req, res) => {
  console.log("comments", req.body)
  const commentData=req.body;
  if(Object.keys(commentData).length>0)
  {
  Inventorydata.findOne({ $or: [{ id: req.body.id.trim() }, { serial: req.body.serial }] }, (err, data) => {
    console.log("ghjk", data["comments"]);
    if (data["comments"] ==="undefined") {
      console.log("empty")
      Inventorydata.findOneAndUpdate({ $or: [{ id: req.body.id }, { serial: req.body.serial }] }, { comments: req.body.comments }, (err, data) => {
        console.log(data);
      })
    }
    else {
      console.log("full")
      Inventorydata.findOneAndUpdate({ $or: [{ id: req.body.id }, { serial: req.body.serial }] }, { comments: data["comments"] + " " + req.body.comments }, (err, d) => {
        console.log(d);
      })
    }
  })
  res.send("comments added");
}
else{
  res.send("please post some content")
}
})

//USER ENTERED PROBLEM TO ADMIN SIDE
app.post('/problem', (req, res) => {
  if(Object.keys(req.body).length>0)
  {
  console.log("lawrence")
  console.log(req.body)
  Inventorydata.findOne({ id: req.body.id }, (err, data) => {
    console.log("cvb", data)
    if (data["problems"] == "") {
      console.log("empty")
      Inventorydata.findOneAndUpdate({ id: req.body.id },  { problems: req.body.problems } , { new: true }, (err, data) => {
        console.log(data);
      })
    }
    else {
      console.log("existed")
      Inventorydata.findOneAndUpdate({ id: req.body.id }, { problems: data["problems"] + `\n` + req.body.problems } , { new: true }, (err, data) => {
        console.log(data);
      })
    }

  })
  res.send("problem posted")
}
else{
  res.send("please post some content")
}
})

//AUTHENTICATION
app.post("/auth", (req, res) => {
  axios
    .post(
      "https://backflipt-accounts.onrender.com/checkAuth",
      {
        session_id: req.body.session_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((err) => {
      res.status(503).send("Server Down");
    });
});

//LOGOUT
app.post("/logout", (req, res) => {
  axios
    .post(
      "https://backflipt-accounts.onrender.com/clearSession",
      { session_id: req.body.session_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) =>
      response.data ? res.send(response.data) : response.send(false)
    );
});






