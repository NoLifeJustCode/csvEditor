const csvFiles=require('../models/csvFiles')
const path=require('path')
const fs=require('fs')
const fastCsv=require('fast-csv')
/**
 * renders the home page
 */
module.exports.home=async (req,res)=>{
    
    let csv= await csvFiles.find().exec()
    
    return res.render('index',{
        csvFiles:csv
    })
}
/**
 * creates a file record in db to match with the filename stored in the userUploads
 */
module.exports.uploadFile=async(req,res)=>{
    try{
    await csvFiles.create({
        filename:req.file.originalname,
        filePath:'./uploads/'+req.file.filename
    })
    return res.redirect('back')
    }catch(e){
        console.log(e.message)
    }
}
/**
 * get paginated result of a file
 */
module.exports.getRows=async(req,res)=>{
    try{
        let id=req.params.id;
        let page=parseInt(req.query.page);
        let limit=parseInt(req.query.limit);
    
        let startIndex=(page-1)*limit;
        let endIndex=(page*limit);
        
        let file=await csvFiles.findById(id).exec();
        
        let csvData=[]
        await fastCsv.parseFile(path.join(__dirname,'../',file.filePath),{
                        headers:true,
                        skipRows:startIndex,
                        maxRows:limit+1
                        })
                         .on('data',data=>csvData.push(data))
                         .on('end',()=>{
                             results={
                                 limit,
                                 page,
                             }
                             if(csvData.length>limit)
                                {
                                    results.next=`http://localhost:3000/api/v1/files/${id}?page=${page+1}&limit=${limit}`;
                                    csvData.pop()
                                }
                             if(page>1)
                                results.prev=`http://localhost:3000/api/v1/files/${id}?page=${page-1}&limit=${limit}`;
                             results.data=csvData   
                             
                            return res.status(200).json(results)

                         })
        
        
    }catch(e){
       
        return res.status(500).send({message:e.message})
    }
}
/**
 * retreive the csv file viewer
 */
module.exports.getCsvExplorer=async function(req,res){
    try{
   
    let csv=await csvFiles.findById(req.params.id);
    return res.render('csvExplorer',{csv})
    }catch(e){
        console.log(e.message)
        return res.send("Invalid file ")
    }
}