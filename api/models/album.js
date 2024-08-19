const mongoose=require("mongoose")
const albumSchema=mongoose.Schema({
title:{
    type:String,
    required:true
},
artist:{
    type:String,
},
description:{
    type:String,
},
coverImage:{
    type:String,
},
price:{
    type:String,
    required:true
}
},{timestamps:true})

module.exports=mongoose.model("Album", albumSchema)