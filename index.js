const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bysunmk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const subscriberCollection = client.db("fitflex").collection("subscribers");
    const galleryCollection = client.db("fitflex").collection("gallery");
    const classCollection = client.db("fitflex").collection("classes");
    const trainerCollection = client.db("fitflex").collection("trainers");
    const userCollection = client.db("fitflex").collection("users");

    // subscriber related api
    app.post("/subscribers", async (req, res) => {
      const subscriber = req.body;

      // check already a subscriber
      const query = { email: subscriber.email };
      const existedSubscriber = await subscriberCollection.findOne(query);

      if (existedSubscriber) {
        return res.send({
          message: "you have already subscribed, Thank You",
          insertedId: null,
        });
      }

      const result = await subscriberCollection.insertOne(subscriber);
      res.send(result);
    });

    //  gallery related api
    app.get("/gallery", async (req, res) => {
      const cursor = galleryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // class related api
    app.get("/classes", async (req, res) => {
      const cursor = classCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/classes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await classCollection.findOne(query);
      res.send(result);
    });

    //  trainers related api
    app.get("/trainers", async (req, res) => {
      const cursor = trainerCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/trainers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await trainerCollection.findOne(query);
      res.send(result);
    });

    app.post("/trainers", async (req, res) => {
      const trainer = req.body;
      const result = await trainerCollection.insertOne(trainer);
      res.send(result);
    });

    //user related api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const isUserExist = await userCollection.findOne(query);

      if (isUserExist) {
        return res.send({
          message: `${user.email} already exist in database`,
          insertedId: null,
        });
      }
      // console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("fitness tracker loading...");
});

app.listen(port, () => {
  console.log(`${port} is booked for fit yourself`);
});
