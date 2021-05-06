const express=require("express")
const mongoose=require("mongoose")
const config=require('config')
const bodyParser=require('body-parser')
const app=express();
const db=config.get('mongoURI')
const cors=require('cors')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())

mongoose.connect(db,{useUnifiedTopology:true,useNewUrlParser:true,useFindAndModify:false})
        .then(()=>{
            console.log("MongoDb is connected")
        })
        .catch(err=>console.log(err))

const PORT=5000;

require('./routes/blog')(app)
require('./routes/auth')(app)
require('./routes/user')(app)

app.listen(PORT,(err)=>{
    console.log(`Server is live at port ${PORT}`)
})