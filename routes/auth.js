const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt= require('bcryptjs');
var jwt=require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser');

const JWT_SECRET="roushanrocks";


//ROUTE 1: create a user using: POST "/api/auth/createuser". No login required
//res.body consist of json string of user details
router.post('/createuser', [
    body('name').isLength({min: 3}),
    body('email').isEmail(),
    body('password').isLength({min: 5})

], async (req, res)=>{
    let success=false
    //If there are errors, then show the error
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success, errors: errors.array() });
    }


    
    // checks whether the email exists already
    try{
    let user=await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({success, error: "Sorry, a user with this email already exists"})
    }
        const salt= await bcrypt.genSalt(10);
        const secPass= await bcrypt.hash(req.body.password,salt);
        user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
    })

    const data={
        user:{
            id:user.id
        }
    }
    
    const authtoken=jwt.sign(data,JWT_SECRET);

    // res.json(user)
    success=true
    res.json({success, authtoken})
}catch(error){
    console.error(error.message);
    res.status(500).send("some error occured");
}
})





//ROUTE 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email','enter a valid email').isEmail(),
    body('password','password cannot be blank').exists()
], async (req, res)=>{
    let success= false
    //If there are errors, then show the error
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {email,password}=req.body;
    try{
        let user= await User.findOne({email});
        if(!user){
            return res.status(400).json({success, errors: "Invalid Credentials" });
        }

        const passwordCompare=await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success= false
            return res.status(400).json({success, errors: "Invalid Credentials" });
        }

        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        success=true
        res.json({success, authtoken})

    
    } catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
    
})


//ROUTE 3: get logged in user details using: POST "/api/auth/getuser". login required
router.post('/getuser', fetchuser ,async (req, res)=>{
    try {
        userId = req.user.id;
        const user= await User.findById(userId).select("-password")//selects all field except password
        res.send(user);
    } catch (error) {
        console.error(error.message);
            res.status(500).send("Internal Server Error");
    }

})

module.exports = router