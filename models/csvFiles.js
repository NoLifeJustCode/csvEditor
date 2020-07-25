const mongoose =require('mongoose');
const csvSchema=new mongoose.Schema({
    filename:{
        type:String,
        required:true,
    },
    filePath:{
        type:String,
        required:true,
    }
},{timestamps:true})

module.exports=mongoose.model('CSV',csvSchema);