const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');

// middleware
app.use(cors());
app.use(express.json());
// middleware


const {
  MongoClient,
  ServerApiVersion,
  ObjectId
} = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lilwv8k.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {

  // Connect the client to the server	(optional starting in v4.7)
  // await client.connect();
  const toyCollection = client.db('mathWorms').collection('allToys');
  const addedtoyCollection = client.db('mathWorms').collection('addedToys');
  const indexkeys = {
    name: 1
  };
  const indexOptions = {
    name: "toyname"
  };
  const result = await toyCollection.createIndex(indexkeys, indexOptions);
  // alltoys
  app.get('/toyname/:text', async (req, res) => {
    const searchText = req.params.text;
    const result = await toyCollection
      .find({
        $or: [{
          name: {
            $regex: searchText,
            $options: "i"
          }
        }],
      })
      .toArray();
    res.send(result)
  });
  app.get('/allToys', async (req, res) => {

    const result = await toyCollection.find().limit(20).toArray();
    res.send(result);
  })
  app.get("/allToys/:id", async (req, res) => {
    const id = req.params.id;
    const query = {
      _id: new ObjectId(id)
    };
    const result = await toyCollection.findOne(query);
    res.send(result);

  })
  app.get("/category/:categories", async (req, res) => {
    console.log(req.params.categories);
    const query = {
      sub_category: req.params.categories
    };
    const result = await toyCollection.find(query).toArray();
    res.send(result);
  })
  // alltoys

  // addToys
  app.get('/addtoys', async (req, res) => {
    console.log(req.query.email);
    let query = {};
    if (req.query ?.email) {
      query = {
        selleremail: req.query.email
      }
    }
    const result = await addedtoyCollection.find(query).toArray();
    res.send(result);
  })
  app.get("/addtoys/:id", async (req, res) => {
    const id = req.params.id;
    const query = {
      _id: new ObjectId(id)
    };
    const result = await addedtoyCollection.findOne(query);
    res.send(result);

  })

  app.post('/addtoys', async (req, res) => {
    const addToy = req.body;
    console.log(addToy);
    const result = await addedtoyCollection.insertOne(addToy);
    res.send(result);
  });
  app.delete('/addtoys/:id', async (req, res) => {
    const id = req.params.id;
    const query = {
      _id: new ObjectId(id)
    }
    const result = await addedtoyCollection.deleteOne(query);
    res.send(result);
  })
  app.put("/addtoys/:id", async (req, res) => {
    const id = req.params.id;
    const updatedToy = req.body;
    const filter = {
      _id: new ObjectId(id)
    };
    const options = {
      upsert: true
    };
    const updated = {
      $set: {
        name: updatedToy.name,
        price: updatedToy.price,
        subcategory: updatedToy.subcategory,
        quantity: updatedToy.quantity,



      }
    }
    const result = await addedtoyCollection.updateOne(filter, updated, options);
    res.send(result);
  })

  // addToys
  // Send a ping to confirm a successful connection
  await client.db("admin").command({
    ping: 1
  });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('math worms is running');
});

app.listen(port, () => {
  console.log(`math worms is running on port ${port}`)
});