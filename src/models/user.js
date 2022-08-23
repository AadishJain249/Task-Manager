const  jwt=require('jsonwebtoken')
const mongo=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const Task = require('./task')
const userSchema=new mongo.Schema(
    {
        name:{
            type:String,
            trim:true,
            required:true
        },
        password:{
            type:String,
            required:true,
            trim:true,
            minlength:7,
            validate(value)
            {
                if(value.toLowerCase().includes('password'))
                {
                    throw new Error('wrong password')
                    
                }
            }
        },
        email:{
            type:String,
            unique:true,
            required:true,
            trim:true,
            lowercase:true,
            validate(value)
            {
                if(validator.isEmail(value))
                {
                    throw new Error('wrong email')
                    
                }
        
            }
               },
        age:{
            type:Number,
            default:0,
            validate(value){
                if(value<0)
                {
                    throw new Error('age must be greater than 18')
                }
            }
        },
        tokens:
        [{
           token:{
            type:String,
            require:true
           }
        }],

    },
        {
            timestamps:true
        }
)
//2 models should have one property each refering to the other model and at least one should not be virtual,
//here the tasks property of User is virtual and does not add to the database, this tasks property is connected to the
//real property of Task i.e. owner, the relation between the two model is now defined by the local field of the model(User)
// and the foreign field of the reference model(Task) which are actually the same as they both store the user id
userSchema.virtual(('task'),{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})
userSchema.methods.toJSON=function()
{
    const user=this
    const userData=user.toObject()
    delete userData.password
    delete userData.tokens
    return userData
}
userSchema.methods.genToken=async function()
{
    const user=this
    const token=await jwt.sign({_id:user._id.toString()},'AadishJain')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.statics.findUser=async(email,password)=>{
    const user=await User.findOne({email})
    if(!user)
    {
        throw new Error('unable to login')
    }
    const pass=await bcrypt.compare(password,user.password)
    if(!pass)
    {
        throw new Error('unable to login')
    }
    return user
}
userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password'))
    {
        user.password=await bcrypt.hash(user.password,8 )
    }
    console.log("aadish is good boy");
    next()
})
userSchema.pre('remove',async function(req,res,next){
    const user=this
    Task.deleteMany({owner:user._id})
    next()
})
const User=mongo.model('User',userSchema
)
module.exports=User