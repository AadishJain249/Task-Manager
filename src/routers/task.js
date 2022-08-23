const auth=require('../middleware/auth')
const Task=require('../models/task')
const express =require('express')
const route=new express.Router()
route.get('/task/:id',auth,async(req,res)=>{
    const _id=req.params.id
    // const task= await Task.findById(id)
    const task=await Task.findOne({_id,owner:user._id})
    try{
        if(!task)
        {
            return res.status(404).send
        }
        res.send(task)
    }
   catch(err){
        // console.log(err);
        res.status(500).send(err)
    }
})
route.get('/task',auth,async(req,res)=>{
    const match={}
    const sort={}
    if(req.query.sortBy)
    {
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }
    if(req.query.completed)
    {
        match.completed=req.query.completed==='true'
    }
    try{
        await req.user.populate({
            path:'task',
            match,
            options:{
                limit:req.query.limit,
                skip:req.query.skip,
                sort
            }
        })
        res.send(req.user.task)
    }
    catch(err){
        console.log(err);
        res.status(500).send(err)

    }
})
route.post('/task', auth ,async(req, res) => {
    // const task=new Task(req.body)
    // console.log("hi");
    const task=new Task({
        ...req.body, // will be holding all data 
        owner:req.user._id // adding a new field whihch contains the user id who is authenciated
    })
    // console.log(task);
   try{ 
    await task.save()
    res.send(task)   
   }    
    catch(err){
        res.status(500).send(err)
    }
    
});
route.patch('/task/:id',auth,async (req,res)=>{
    const update=Object.keys(req.body)
    const allowedUpdate=['desription','completed']
    // console.log(update);
    const isValid=update.every((upd)=>allowedUpdate.includes(upd))
    // console.log(isValid);
    if(!isValid)
    {
        return res.status(400).send('mismatched data')
    }
    try{
    const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
    update.forEach((update)=>task[update]=req.body[update])
    await task.save()
    if(!task)
    {
        return res.status(404).send('data dont match')
    }
    res.send(task)
    }
    catch(err)
    {
        res.status(400).send(err)
    }
})
route.delete('/task/:id',auth,async(req,res)=>{
    try {
        // const users=await Task.findByIdAndDelete(req.params.id)
        const users=await Task.findOneAndDelete({_id,owner:user._id})
        if(!users)
        {
            return res.status(404).send('data dont match')
        }
        console.log(users);
        res.send(users)
            
    } catch (error) {
        res.status(400).send(err)
    }
})
module.exports=route