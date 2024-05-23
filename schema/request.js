const mongoose=require('mongoose');
const requestSchema=mongoose.Schema(
    {
        requesttime:{type:Date},
        location:{
            coordinates:[Number],
            address:{type:String}
        },
        civilianId:{type:String},
        copId:{type:String},
        status:{type:String}
    }
)

const Request=mongoose.model('Request',requestSchema);
module.exports.Request=Request;
