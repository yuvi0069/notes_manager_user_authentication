const express=require('express');
const { User } = require('../table/db');
const bcrypt=require('bcryptjs')
const route=express.Router();
const { body, validationResult } = require('express-validator');
const jwt=require('jsonwebtoken');
const usermiddleware = require('../middlwares/usermiddleware');
const JWT_TOKEN='yuviabhi0012';
route.post("/signup",[body('name','enter a valid name').isLength({min:'5'}),body('email','enter a valid email').isEmail()],async (req,res)=>{
const errors=validationResult(req);
let success=false;
if(!errors.isEmpty()){
    res.json({success,errors:errors.array()});
}
else{
const check=await User.findOne({email:req.body.email});
if(check){
    res.json({success,msg:"user already exist"});
}
else{
const salt=await bcrypt.genSalt(10);
const secp=await bcrypt.hash(req.body.password,salt);
const user=await User.create({
    name:req.body.name,
    email:req.body.email,
    password:secp,
});
const payload={
    user:{
        id:user.id
    }
}
const authtoken=jwt.sign(payload,JWT_TOKEN);
success=true;
res.json({success,authtoken});
}
}
})
route.post("/signin",body('email','enter valid email').isEmail(),async (req,res)=>{
let user=await User.findOne({email:req.headers.email});
let success=false;
if(!user)
{
    res.json({success,msg:"Please create account"});
}
else{
const comp=await bcrypt.compare(req.headers.password,user.password);
console.log(comp);
if(!comp)
{
    res.status("401").json({success,msg:"invalid"});
}
else{
    const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_TOKEN);
      success = true;
      res.json({ success, authtoken })
}
}
}
)
route.post("/getuser",usermiddleware,async (req,res)=>{
    try {
     userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json({msg:user.name});
      } catch (error) {
        console.error(error.message);
        res.status(500).json({msg:"Internal Server Error"});
      }
})
route.post("/forgot",async(req,res)=>{
    const check=await User.findOne({email:req.body.email});
    let success=false;
if(!check){
    res.json({success,msg:"invalid mail"});
}
else{
    const secret = JWT_SECRET + check.password;
    const token = jwt.sign({ email: check.email, id: check._id }, secret, {
      expiresIn: "5m",
    });
}

})
module.exports=route;