const express=require('express')
const config=require('./dev.json');
const mongoose=require('./config/mongoose')
process.env.config=config

const app=express()
app.set('view engine','ejs')
app.set('views','./views')
app.use('/assets',express.static('./assets'))

app.use('/',require('./Routes/index'))

app.listen(config.PORT,(err)=>{
    if(err){
        console.log(e)
        return;
    }
    console.log("Server running on port ", config.PORT)
    
})

