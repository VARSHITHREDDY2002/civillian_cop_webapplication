const mongoose=require("mongoose");

const copSchema=new mongoose.Schema({
      userId:{type:String,unique:true,required:true},
      displayName:{type:String},
      phone:{type:String},
      email:{type:String,unique:true},
      earnedRatings:{type:Number},
      totalRatings:{type:Number},
      location:{
         type:{
            type:String,
            required:true,
            default:"Point"
         },
         address:{type:String},
         coordinates:[Number]
      }
})
copSchema.index({"location": "2dsphere", userId: 1});
const Cop=mongoose.model('Cop',copSchema);
module.exports.Cop=Cop;



