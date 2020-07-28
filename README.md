/*
 * Setup and Execution
 */

 1.make sure 'pwd' is project directory
 2.use 'npm install' to install all dependencies needed for the project to execute without errors
 3.use 'npm start' to start the server 

 /*
  *  Project Directory and Structure
  */
  1.models
        contains all the model Schema connected to csv Database
        Schemas contained:
           csvFiles Schema


  2. Controllers:
         contains Controller required to router endpoint to respective actions
         Controllers:
                csvFilesController:
                    this file contains logic for all endpoints like uploading,filtering,paginated results etc
  3.Routes:
         contains Routes need to route endpoints to respective actions
          api:
            contains the apis
            v1:
                version 
                files:
                    contains all the file related routes

  4.config:
        contains configuration files to setup the basic properties need for use
        
        mongoose:
            a db connection to mongodb
       
        
 5. assets:
        contains all the static files
 
 6. upload:
        contains all the uploaded csv files
/*
 *  Endpoints and responses
 */

 1.upload csv File:
    URL:
        localhost:3000/api/v1/files/uploads
    Method:
        POSt
    params:
        csvFile
    Validation:
        csv extenstion
    Response:
        success
    
2.get Rows of data of a csv file:
    URL:
        localhost:3000/api/v1/files/:id
    Method:
        GET
    params:
        id
    Validation:
        check if file exists 
    Response:
        return rows of paginated data as json
