const express= require('express');/* getting access to the express framework */
const path = require('path');/* A utility to construct full system paths based on relative paths  */
const app = express();/* creating an express app */

app.use(express.static(path.join(__dirname,'public')));

/* accessing server root level route *res-request ,res(response object)*/
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'pages/index.html'));
});

/* Run the server */
const port = process.env.PORT || 3000;  
/* .Listen -app will start lsitening for requests - port(mailbox number/prot number) */
app.listen(port,()=>{
    console.log(`Server runnning on htps:/localhost:${port}`)
});