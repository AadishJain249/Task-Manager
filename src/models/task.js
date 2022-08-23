const mongo=require('mongoose')
const taskSchema=new mongo.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        required:true,
        trim:true,
        default:false
    }
    ,
    owner:
    {
        type:mongo.Schema.Types.ObjectId,
        required:true,
        ref:'User' 
    },
},{
    timestamps:true
}

)
const Task=mongo.model('Task',taskSchema)
module.exports=Task