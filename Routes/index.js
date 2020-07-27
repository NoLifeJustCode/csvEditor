const Router =require('express').Router();
const controller=require('../controller/csvFileController')
// route to apis 

Router.use('/api',require('./api/index'))
// route to home page
Router.get('/',controller.home)
//route to explorer page
Router.get('/:id',controller.getCsvExplorer)
module.exports=Router;