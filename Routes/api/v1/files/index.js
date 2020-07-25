const Router=require('express').Router();
const multer=require('multer')
const path=require('path')
const fs=require('fs')
const csvFiles=require('../../../../models/csvFiles')
const csvController=require('../../../../controller/csvFileController')
/**
 * setup multer for img upload
 */
const upload=multer({storage:multer.diskStorage({
    destination:(req,file,cb)=>{
        let destPath=path.join(__dirname,'../../../../uploads');
        if(!fs.existsSync(destPath))
            {
                fs.mkdirSync(destPath)
            }
        cb(null,destPath)//setup directory if doesn;t exist
    },
    filename:(req,file,cb)=>{
        var temp=new Date().toISOString().replace(/[\W_]+/g,"");
        temp+=""+path.extname(file.originalname)
       // cb(null,req.user.id+""+path.extname(file.originalname))
       cb(null,temp)
    }//setup filename

}),
fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.csv') {//only use csv or throw error
        return callback(new Error('Only csv are allowed'))
    }
    callback(null, true)
},

})
// route to handle csv file uploads
Router.post('/Uploads',upload.single('csv'),csvController.uploadFile)
// get csv data
Router.get('/:id',csvController.getRows)
module.exports=Router