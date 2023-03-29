const mongoose=require('mongoose');

const idgenerateschema=new mongoose.Schema({
    category:{
        type:String,
        default:" "
    },
    count:{
       type:Number
    }
},
{
    versionKey: false,
})

const Idgenerate=new mongoose.model("Idgenerate",idgenerateschema)
module.exports=Idgenerate;

