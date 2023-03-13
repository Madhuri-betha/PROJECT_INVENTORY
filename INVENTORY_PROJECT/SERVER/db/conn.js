const mongoose=require("mongoose");
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/Inventory",{
    
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connection successfull");
}).catch((err)=>{
    console.log(err)
})

//defining schema