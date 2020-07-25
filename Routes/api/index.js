const Router =require('express').Router();
Router.use('/v1',require('./v1/index'))
module.exports=Router;