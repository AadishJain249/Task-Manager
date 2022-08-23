const express=require('express')
require('./src/db/mongodb')
const app=express()
const port=3001
const Userroute =require('./src/routers/user')
const Taskroute =require('./src/routers/task')
app.use(express.json())
app.use(Userroute)
app.use(Taskroute)
app.listen(port, () => {
    console.log('App listening on port 3000!');
});
const Task=require('./src/models/task')
const User=require('./src/models/user')
const multer=require('multer')
const upload=multer({
    dest:'images' // short form of destination
})
app.post('/upload', upload.single('upload'),(req,res)=>{
    res.send()
})
// const main=async()=>{
//     const task=await Task.findById('6302493fd01b1a42690bc48e')
//     await task.populate('owner').execPopulate()
// //     const user=await User.findById('6302493fd01b1a42690bc48e')
// //     console.log(user.owner);
// }