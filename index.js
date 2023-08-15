const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
console.log(process.env)

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.ker7tlm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("carDoctor")
    const services = database.collection("carServices")
    const products = database.collection('carProducts')


    app.get('/services', async (req, res) => {
      const query = {}
      const options = {
        projection: { _id: 1, img: 1, price: 1, title: 1, facility : 1 }
      }
      const cursor = services.find(query, options)
      const data = await cursor.toArray()
      res.send(data)
    })


    app.get('/services/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const cursor = await services.findOne(query)
      res.send(cursor)
    })


    app.get('/products', async (req, res) => {
      const cursor = await products.find().toArray()
      res.send(cursor)
    })

    app.post('/addnewservice', async (req, res) => {
      const data = req.body
      const {service_id, title, price, img, description, facility} = data
      //console.log(data)
      const doc ={
        service_id, title, price, img, description, facility
      }
      const newService = await services.insertOne(doc)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");



  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})