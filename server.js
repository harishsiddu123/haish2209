const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const upload = multer();

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname),"./client/build"));
app.listen(9999,()=>{
    console.log("listening to port 9999");
})
let mongodbConnected = async()=>{
 try{
   await mongoose.connect("mongodb://localhost:27017/Company");
   console.log("successfully connected mongodb");
}catch{
console.log("unable to connect");
}
}


let userSchema =new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

let Employee =new mongoose.model("employees",userSchema);

app.post("/userSign",upload.none(),(req,res)=>{
    let data = new Employee({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    });
    try{
    Employee.insertMany(data);
    console.log(data);
    }catch{
    console.log(err);
    }
   res.json({status:true,msg:"user created successfully"});
});

app.post("/userLogin",upload.none(),async(req,res)=>{
    let data =await Employee.find({email:`${req.body.email}`});
    // try{
    //  res.json(req.body.password === data[0].password);
    //  res.json({userData:data})
    // }catch{
    // console.log(err);
    // }
    if(req.body.password === data[0].password){
        res.json({data:data[0],status:true,userData:data})
    }else{
        res.json({status:false,msg:"not valid"});
    }
});

app.get("/getUser",async(req,res)=>{
    let data = await Employee.find()
try{
res.json(data)
}catch{
res.json(err);
}
});

app.delete("/userDel",upload.none(),async(req,res)=>{
let data = await Employee.deleteOne({email:`${req.body.email}`});
try{
res.json(data)
}catch{
res.json({msg:"error"});
}
});

app.put("/update",upload.none(),async(req,res)=>{
let data = await Employee.find({email:`${req.body.email}`}).updateMany({password:req.body.password});
console.log(data);

res.json("user updated");

})

mongodbConnected();