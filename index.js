const express = require('express');
const http=require('http');
const ejs=require('ejs');
const bodyParser = require('body-parser');
const socketIo=require('socket.io');
const mongoose = require('mongoose');
const dataModel = require('./schema/cops.js');
const { Saverequest,nearestcops,copdetails,updateRequests }=require('./dboperations.js');
const Request=require('./schema/request.js');
const Cop = dataModel.Cop;
const fs = require('fs');
const { Socket } = require('dgram');
const app = express();
const server=http.createServer(app);
const io=socketIo(server);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./public')); // setting the folder name (public) where all the static files like css, js, images etc are made available
app.set('view engine','ejs');

const JsonData = JSON.parse(fs.readFileSync('./schema/cops.json', 'utf-8'));

mongoose.connect('mongodb+srv://kanchireddyvarshith:8jDuXZL3cwv7iTfZ@cluster0.ijyfzbp.mongodb.net/test')
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

io.on('connection',(socket)=>{
    console.log("A new user connected");
    console.log(socket.id);
    socket.on('join',(data)=>{
        socket.join(data.userid);
        console.log(data.userid);
    })



    socket.on('request-for-help',async(eventdata)=>{
        const currentdate=new Date();
        const requestId= new mongoose.Types.ObjectId();
        const location={
            coordinates:[
                eventdata.location.longitude,
                eventdata.location.latitude],
            address:eventdata.location.address
        }
      const ans= await Saverequest(requestId,currentdate,location,eventdata.userId,'waiting');
      console.log(ans);
      const nearpolice= await nearestcops(eventdata.location);
      console.log(nearpolice);
      eventdata.requestId=requestId;
      for(let i=0;i<nearpolice.length;i++)
      {
         io.sockets.in(nearpolice[i].userId).emit('request-for-help',eventdata)
      }
    })

    socket.on('request-accept',async(eventdata)=>{
        const id=eventdata.requestDetails.civilianId;
        console.log(id);
        console.log(eventdata);
        const ans=await updateRequests(eventdata.requestDetails.requestId,eventdata.copdetails.userId,'engaged');
        console.log(ans);
        io.sockets.in(id).emit('request-accepted',eventdata.copdetails);
        console.log("eventdata emitted suceesfully");
    })
})

app.get('/cops',function(req,res){
    const lat=Number(req.query.lat);
    const long=Number(req.query.lng);
    const maxdistance=Number(2000);
    Cop.find({location:{
             $near:{
                $geometry:{
                    type:"Point",
                    coordinates:[long,lat]
                },
                $maxDistance:maxdistance
             }
    }}).exec()
    .then((users)=>{
        console.log((users));
        res.json(users);
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.get('/user',function(req,res){
    const uname="raju";
    res.render('civilian',{user:uname});
})

app.get('/police',function(req,res){
    uname=req.query.id;
    console.log( "from initia request"+uname);
    res.render('cops',{user:uname});
})

app.get('/cops/info',async(req,res)=>{
    const id=req.query.id;
    const ans=await copdetails(id);
    console.log(ans);
    res.json(ans);
})

server.listen('3000',function(req,res){
    console.log("server running on port 3000");
})