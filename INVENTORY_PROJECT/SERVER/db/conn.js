
const mongoose=require('mongoose')
mongoose.set("strictQuery",false)
mongoose.connect("mongodb://127.0.0.1:27017/Inventory",{
    useNewUrlParser :true,
})

const conn=mongoose.connection;
//if connection is successfull
conn.on("connected", ()=>{
    console.log("database Connected sucessfully");
})
//if connection fails
conn.once("disconnected", ()=>{
    console.log("database disConnected sucessfully");
})
module.exports = conn;