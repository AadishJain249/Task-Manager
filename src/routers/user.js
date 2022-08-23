const express =require('express')
const multer=require('multer')
const route=new express.Router()
const User=require('../models/user')
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')
route.get('/hello/me', auth, async (req,res) => {
    res.send(req.user);
});
route.get('/hello/:id',async(req,res)=>{
   try{
        const id=req.params.id
        const users= await User.findById(id)
        if(!users)
        {
            return res.status(404).send
        }
        res.send(users)
    }
   catch(err){
        res.status(500).send(err)
    }
})
route.post('/hello', async(req, res) => {
    try{
        const user=new User(req.body)
        const token=await user.genToken()  
        await user.save()
        res.send({user,token})   
    }
    catch(err)
    {
        res.status(500).send(err)

    }
});
route.post('/hello/login',async(req,res)=>{
    try
    {
        const user=await User.findUser(req.body.email,req.body.password)
        // console.log(user);
        // console.log("hi");
        const token=await user.genToken()  
        res.status(200).send({user,token})
    }
    catch(err)
    {
        res.status(400).send()
    }
})

route.post('/hello/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        })
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
});
route.patch('/hello/me',auth,async(req,res)=>{
    console.log("hiihhih");
    const update=Object.keys(req.body)
    const allowedUpdate=['name','age','password','email']
    console.log(update);
    const isValid=update.every((upd)=>allowedUpdate.includes(upd))
    console.log(isValid);
    if(!isValid)
    {
        return res.status(400).send('mismatched data')
    }
    try{
    update.forEach((upd)=>req.user[upd]=req.body[upd])
    await req.user.save()
    res.send(req.user)
    }
    catch(err)
    {
        res.status(400).send(err)
    }
})
route.delete('/hello/me',auth,async(req,res)=>{
   try
   {
    req.user.remove()
    res.send(req.user) 
   }
   catch(err)
   {
    res.send('cant')
   }
})
const upload=multer(
    {
        dist:"avatar"
    }
)
route.post('/upload/me/avatar',upload.single('upload'),(req,res)=>{
    res.send()
})
module.exports=route