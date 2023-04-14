const router = require("express").Router();
const {User,validate} =require("../models/user");
const bcrypt = require("bcrypt");
const auth= require("../middleware/auth");
const admin= require("../middleware/admin");
const validObjectId= require("../middleware/validObjectId");

//create User
router.post("/",async(req,res)=>{
  const { error } = validate(req.body);
  if(error) return res.status(400).send({message:error.details[0].message});

  const user= await User.findOne({email: req.body.email});
  if(user)
    return res.status(403).send({message:"User eith given email already exists"});

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    let newUser = await new User({
      ...req.body,
      password:hashPassword,
    }).save();

    newUser.password=undefined;
    newUser._v=undefined;

    req.status(200).send({data:newUser,message:"Account created successfully"});

});

//get all users
router.get("/",admin,async(req,res) =>{
  const users =await User.find().select("-password -_v");
  res.status(200).send({data:users});
});

//get user by id
router.get("/:id",[validObjectId,auth],async(req,res)=>{
  const user = await User.findById(req.params.id).select("-password-_v");
res.status(200).send({data:user});
});

//update user by id
router.put(":/id",[validObjectId,auth],async(req,res)=>{
  const user= await User.findByIdAndUpdate(
    req.params.id,
    { $set:req.body},
    {new:true}
  ).select('-password-_v');
  res.status(200).send({data:user});
});

//delete user by id
router.delete(":/id",[validObjectId,admin],async(req,res)=>{
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send({message:"successfully deleted user"});
});

module.exports= router;
