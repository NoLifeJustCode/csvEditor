
/**
 * Has the basic csvEditing functionality
 */

class CsvEditor{
    constructor(){
            this.data=[];
            this.view=[];
            this.headers=[];
            this.resourceId='';
            this.url='http://localhost:3000/api/v1/files/';
            let temp=document.URL
            temp=temp.split('/')
            this.resourceId=temp[temp.length-1];
            this.url+=this.resourceId
            this.init= this.init.bind(this) 
            this.getPage=this.getPage.bind(this)
           
    }
    /**
     * sort both string based and number based values
     * 
     */
    sort=(ascending,filter)=>{
            let comparator=(a,b)=>{
                let out=a[filter]-b[filter]
                if(isNaN(out)){
                    out=String(a[filter]).localeCompare(String(b[filter]))
          
                }
          
                return out;
            }
            if(!ascending)
                comparator=(a,b)=>{
                    let out=b[filter]-a[filter]
                    if(isNaN(out)){
                        out=String(b[filter]).localeCompare(String(a[filter]))
                       
                    }
                    
                    return out;
                }
            this.view.sort(comparator)
            
    }
    /**
     * Search for patterns matching the exact case
     * @param {*} data 
     * @param {*} key 
     * @param {*} filter 
     */
    searchExactCase(data,key,filter){
        let ans=false;
        if(filter==''){
            for(let i in data)
                ans=ans||data[i]==key;
        }else
        ans=data[filter]==key;
        return ans;
    }
    /**
     * searches for a key in the document with specified filter
     * filter is a option object that contains the type of search pattern to run for 
     * include specifies whether to include or exclude th results
     */
    search=(key,filter,include)=>{
        if(key==undefined||filter==undefined||include==undefined)
            return this.view;
        let data=this.view.filter((item=>{
                    let ans=this.searchExactCase(item,key,filter);
                    return include?ans:!ans;            
        }))
        console.log('data',data)
        this.view=data;
    }
    /**
     * initialize
     */
     async init(){
         
         let url=this.url+`?page=1&limit=5`;
         this.data=await this.fetchResource(url);
         this.view=this.data.data;
        for(let i in this.data.data[0]){
            this.headers.push(i)
        }
        return;
    }
    /**
     * Get next paginated result
     */
    next=async()=>{
        if(!this.data.next)
            return;
            this.data=await this.fetchResource(next);
            this.view=this.data.data;
        return;
    }
    /**
     * get previous paginated results 
     */
    prev=async()=>{
        if(!this.data.prev)
            return;
        this.data=await this.fetchResource(this.data.prev);
        this.view=this.data.data;
        return;
    }
    /**
     * get page retrieves a certain page with certain limits 
     * can be used to offset page numbers or change limits
     * @param {*} page 
     * @param {*} limit 
     */
    async getPage(page,limit){
        let url=`http://localhost:3000/api/v1/files/${this.resourceId}?page=${page}&limit=${limit}`;
        this.data=await this.fetchResource(url);
        this.view=this.data.data;
    }
    /**
     * fetch resource from specified url
     * @param {*} url 
     */
    async fetchResource(url){
        return await fetch(url)
             .then(response=>response.json())
             .catch(e=>console.log(e))
    }
}

/**
 * Csv ui handler that extends the basic csvEditor
 */
class csvView extends CsvEditor{
    constructor(){
        super();
        this.sortFilter={
            filter:null,
            order:true,
        }
        this.rootElement=document.getElementById(this.resourceId);
        this.init=this.init.bind(this)
        this.sortEventHandler=this.sortEventHandler.bind(this)
        this.setupSearch=this.setupSearch.bind(this)
        this.searchEventHandler=this.searchEventHandler.bind(this)
        this.setupNav=this.setupNav.bind(this)
    }
    /**
     * initialize the ui
     */
    async init(){
        await super.init();
        let csvHeaders=this.createHeaders();
        let csvRows=this.createRows();
        this.rootElement.appendChild(csvHeaders);
        this.rootElement.appendChild(csvRows);
        this.setupSearch()
        this.setupNav()
    }
    /**
     * setup the nav ui part like prev ,next and resource limit
     */
    setupNav(){
        let prev=document.getElementById('prev');
        let next=document.getElementById('next');
        let limit=document.getElementById('limit');
        limit.addEventListener('change',this.limitChangeHandler);
        prev.addEventListener('click',this.prevHandler);
        next.addEventListener('click',this.nextHandler);
    }
    /**
     * setup headers
     */
    createHeaders=()=>{
        let headers=document.createElement('tr')
        headers.classList.add('headers')
        for( let i of this.headers){
            let th=document.createElement('th');
            let btn=document.createElement('button')
            btn.classList.add('headerBtn')
            btn.addEventListener('click',(e)=>this.sortEventHandler(i));
            btn.appendChild(document.createTextNode(i));
            th.appendChild(btn)
            headers.appendChild(th);
        }
        return headers;
    }
    /**
     * create the data rows
     */
    createRows=()=>{
            let data=this.view;
            let tbody=document.createElement('tbody')
            for(let i of data){
                    tbody.appendChild(this.createRow(i))
            }
            return tbody;
    }
    /**
     * create a single data row
     */
    createRow=(data)=>{
            let row=document.createElement('tr');
            for(let i of this.headers){
                let cell=document.createElement('td');
                cell.appendChild(document.createTextNode(data[i]));
                row.appendChild(cell)
            }
            return row;
    }

    /**
     * render function to render the ui with values
     */
    render=()=>{
        this.rootElement.getElementsByTagName('tbody')[0].remove();
        this.rootElement.appendChild(this.createRows());
    }

    /**
     * sort event handler handles the sorting of list based on click on a particular field
     * toggles the sort order initial sort is ascending by default
     * @param {*} filter 
     */
    sortEventHandler(filter){
      
            console.log(filter)
            if(this.sortFilter.filter!=filter){
                this.sortFilter={
                    filter,
                    order:true,
                }
            }else
                this.sortFilter.order=!this.sortFilter.order;
            if(this.sortFilter.filter==null||this.sortFilter.filter==undefined)
                return ; 
            this.sort(this.sortFilter.order,this.sortFilter.filter)
            this.render();
    
    }
    /**
     * sets up the search filter to retrieve search filter to customize pattern search
     */
    setupSearch(){
            let dropdown=document.getElementById('dropdown');
            let filterImg=document.getElementById('filterImg');
            let selectFilter=document.getElementById('filter');
            let searchbtn=document.getElementById('search')
            for(let i of this.headers){
                let option=document.createElement('option')
                option.appendChild(document.createTextNode(i));
                selectFilter.appendChild(option);
            }
            filterImg.addEventListener('click',(e)=>{
                if(dropdown.classList.contains('visible'))
                    dropdown.classList.remove('visible');
                else
                    dropdown.classList.add('visible');
            })
            searchbtn.addEventListener('click',this.searchEventHandler)
            document.getElementById('reset').addEventListener('click',(e)=>{
                e.preventDefault()
                e.stopPropagation()
                this.view=this.data.data;
                console.log(this.view)
                this.render();
            })
            return ;
    }
    /**
     * handles the search event
     * @param {*} e 
     */
    searchEventHandler(e){

        let filterBy=document.getElementById('filter').value;
        let include=document.getElementById('include').checked;
        let key=document.getElementById('searchInput').value;
        document.getElementById('dropdown').classList.remove('visible')
        if(key=='')
            return;
        this.search(key,filterBy,include);
       //console.log(this)
        console.log(filterBy,include);
        this.render()
    }
    /**
     * changes limit of resources viewed by default it is 5
     */
    limitChangeHandler=async(e)=>{
        let val=e.target.value;
        await this.getPage(this.data.page,val);
        this.render();
    }
    /**
     * nav handler to navigate to next or prev resource
     */
    prevHandler=async (e)=>{
            console.log('prev')
            await this.prev();
            this.render();
    }
    nextHandler=async(e)=>{
        await this.next();
        this.render();
    }
}
let csv=null;
window.onload=async(e)=>{
    csv=new csvView()
    await csv.init();
    console.log(csv)
}