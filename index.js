
 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
require('dotenv').config()
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// coffeeMaster
// YRyCxLVtG5qpmhpg

app.use(cors())
app.use(express.json())

 

const uri = `mongodb+srv://${process.env.USER_NM}:${process.env.USER_PASS}@cluster0.dsz3qaf.mongodb.net/?retryWrites=true&w=majority`;

 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const coffeCollection = client.db('coffeesDB').collection('coffees')
    
    app.get('/coffees', async (req, res) => {
      const cursor = coffeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
   })

   app.get('/coffees/:id', async (req , res) => {
      const id = req.params.id
      const query = { _id : new ObjectId(id)}
      const result = await coffeCollection.findOne(query)
      res.send(result)
   })

    app.post('/coffees', async (req,res) => {
      const newCoffe = req.body;
      console.log(newCoffe);
      const result = await coffeCollection.insertOne(newCoffe)
      res.send(result)
    })

    app.delete('/coffees/:id', async (req , res) => {
       const id = req.params.id
       const query = {_id : new ObjectId(id)}
       const result = await coffeCollection.deleteOne(query)
       res.send(result)
    })

    app.put('/coffees/:id', async (req, res) => {
       const id = req.params.id 
       const filter = {_id : new ObjectId(id)}
       const option = {upsert : true}
       const update = req.body
       console.log(update);
       const coffee = {
        $set : {

            name : update.name,
            price : update.price,
            photo : update.photo,
            supplier : update.supplier,
            taste : update.taste,
            category  : update.category,
            details : update.details
        }
       }
       const result = await coffeCollection.updateOne(filter,coffee,option)
       console.log(result);
       res.send(result)
    })
   

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
 
  }
}
run().catch(console.dir);




app.get('/', (req , res) => {
    res.send('Coffee server is making running')
})

app.listen(port , () => {
    console.log(`coffee server is running port : ${port}`);
})