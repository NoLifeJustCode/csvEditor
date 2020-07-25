const Router =require('express').Router();
Router.use('/files',require('./files/index'))
module.exports=Router;