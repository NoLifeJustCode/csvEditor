/**
 * validate the csv filed upload
 * @param {} form 
 */

function formValidate(form){
        let csvFile=document.getElementById('csvFile')
        return csvFile.value.endsWith(".csv");
}