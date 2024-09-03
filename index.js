const express=require('express')
const cors=require('cors');
const mongoose=require('mongoose')
require('./database/config')
const app=express();

const technology=require('./models/technology');
async function insert(){
    await technology.create({
        techname:"Row Planter",
        crop:"Pumpkins",
        location:[47.7511, -120.7401]
    })
}
app.use(express.json());
app.use(cors());
app.post('/techinput',async(req,resp)=>{
    let technologies=new technology(req.body);
    let result=await technologies.save();
    resp.send(result)
})
app.get('/',(req,resp)=>{
    resp.send("app is working");
})
app.get('/map',async(req,resp)=>{
    let tech=await technology.find();
    if(tech.length>0){
        resp.send(tech)
    }
    else{
        resp.send({result:"No technology"})
    }
})
app.get('/map/:crop', async (req, resp) => {
    try {
      
        const crop = req.params.crop;

        if (!crop) {
            return resp.status(400).json({ message: "Crop name is required" });  
        }

        
        const results = await technology.find({ crop: crop });

        if (results.length > 0) {
            resp.json(results); 
        } else {
            resp.status(404).json({ message: "No Records Found" }); 
        }
    } catch (error) {
        console.error('Error fetching technologies:', error);
        resp.status(500).json({ message: "Internal Server Error" }); 
    }
});

app.get('/search/:key', async (req, res) => {
    try {
        // Get the search key from the request parameters
        const searchKey = req.params.key;

        // Perform the search using a case-insensitive regex
        const results = await technology.find({
            "$or": [
                { crop: { $regex: searchKey, $options: 'i' } } // Case-insensitive search
            ]
        });

        // Send the results back to the client
        res.json(results);
    } catch (error) {
        // Handle any errors that occurred during the search
        console.error('Error during search:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(5000);