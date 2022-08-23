const mongo=require('mongoose')
const link='mongodb+srv://aadish:aadishjain@cluster0.lyfmp6y.mongodb.net/?retryWrites=true&w=majority'
mongo.connect(link)
    .then(function(result){
        console.log("connected");
    })
    .catch((err)=>
    {
        console.log(err);
    })
