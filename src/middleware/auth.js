const jwt=require('jsonwebtoken')
const User=require('../models/user')
const auth=async (req,res,next)=>{
    try {
        const token=req.header('Authorization').replace('Bearer ','')
        // console.log(token);
        const decode=jwt.verify(token ,'AadishJain') // it is to verify the name of token
        // console.log(decode._id);
        const user=await User.findOne({_id:decode._id,'tokens.token':token})
        // console.log(user);
        if(!user)
        {
            throw new Error('pls authentciate')
        }
        req.token=token
        req.user=user
        next()
    } catch (error) {
        res.status(400).send(error)
    }
}
module.exports=auth