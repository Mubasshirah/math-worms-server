const express=require('express');
const app=express();
const port=process.env.PORT || 5000;
const cors=require('cors');

// middleware
app.use(cors());
app.use(express.json());
// middleware

app.get('/',(req,res)=>{
    res.send('math worms is running');
});
app.listen(port,()=>{
    console.log(`math worms is running on port ${port}`)
});