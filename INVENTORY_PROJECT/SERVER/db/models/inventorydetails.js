const mongoose=require('mongoose');
const validator=require("validator")

const Inventoryschema = new mongoose.Schema({ 
    id:{
        type:String,
    },   //defining structure of a document 
    category:{
        type:String,
        trim:true
    },
    userid:{
        type:String,
        trim:true
    },
    model:{
        type:String,
        trim:true
    } ,
    serial: {
        type:String,
        trim:true
    },
    date:{
        type:String
    },
    comments:{ 
        type:String
    },
    problems:{type:String},
    
},
{ timestamps: true },
{
    versionKey: false,
})

const Inventorydata=new mongoose.model("Inventorydata",Inventoryschema);
// const Inventorydata=new mongoose.model("Inventorydata",Inventoryschema);

module.exports=Inventorydata;  //collection exporting