const mongoose=require('mongoose');
const { Request }=require('./schema/request.js');
const { Cop } =require('./schema/cops.js');


function Saverequest(requestId,currentdate,location,civilianId,status)
{
    try{
        const hello=new Request({
            '_id':requestId,
            location:location,
            requesttime:currentdate,
            civilianId:civilianId,
            status:status
        });

        return hello.save();
    }
    catch(err){
         console.log(err);
         return err;
    }
    
}

function nearestcops(location){
   
        const long=location.longitude;
        const lat=location.latitude;
       
     return  Cop.find({location:{
            $near:{
               $geometry:{
                   type:"Point",
                   coordinates:[long,lat]
               },
               $maxDistance:2000
            }
   }}).exec()
   .then((users)=>{
    //    console.log((users));
       return users;
   })
   .catch((err)=>{
       console.log(err);
       return err;
   })
    

}

function copdetails(id){
    return Cop.findOne({userId:id}).exec()
    .then((user)=>{
        console.log(user);
        return user;
    })
    .catch((err)=>{
        console.log(err);
    })
}

function updateRequests(requestId, copId, status) {
    return Request.findOneAndUpdate(
        { "_id": requestId },
        { $set: { "copId": copId, "status": status } },
        { new: true } // To return the updated document
    ).exec()
    .catch((err) => {
        console.log(err);
    });
}

module.exports.Saverequest=Saverequest;
module.exports.nearestcops=nearestcops;
module.exports.copdetails=copdetails;
module.exports.updateRequests=updateRequests;