const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient =require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pukwa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('projectFile'));
app.use(fileUpload());

const port =5000;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("creativeAgency").collection("services");

  const orderInfo = client.db("creativeAgency").collection("orders");

  const clientsReviews = client.db("creativeAgency").collection("reviews");

  const adminMembers = client.db("creativeAgency").collection("adminMembers");



  app.post('/addServices', (req,res)=>{
    const tasks= req.body;
    
    servicesCollection.insertMany(tasks)
    .then(result=>{
        console.log(result.insertedCount);
        res.send(result.insertedCount)
    })
})
app.get('/services', (req,res)=>{
  servicesCollection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})

app.get('/services/:id', (req,res)=>{
  servicesCollection.find({id:req.params.id})
  .toArray((err, documents)=>{
    res.send(documents[0])
  })
})

app.post('/addOrderInfo', (req, res) => {
  const newOrder = req.body;
  orderInfo.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0)
    })

})

app.get('/orderedServices',(req,res)=>{
  orderInfo.find({email:req.query.email})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})

app.post('/addReviews', (req,res)=>{
  const reviews= req.body;
  
  clientsReviews.insertMany(reviews)
  .then(result=>{
      console.log(result.insertedCount);
      res.send(result.insertedCount)
  })
})

app.get('/reviews', (req,res)=>{
  clientsReviews.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})

app.post('/addReview', (req, res) => {
  const newReview = req.body;
  clientsReviews.insertOne(newReview)
    .then(result => {
      res.send(result.insertedCount > 0)
    })

})

app.get('/orderedAllServices',(req,res)=>{
  orderInfo.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})

app.post('/addAdmin', (req, res) => {
  const newAdmin = req.body;
  adminMembers.insertOne(newAdmin)
    .then(result => {
      res.send(result.insertedCount > 0)
    })

})
app.get('/isAdmin', (req, res) => {
  adminMembers.find({adminEmail:req.query.email})
  .toArray((err, documents) => {
      if(documents.length){
          res.send(documents.length > 0);
      }
  });
});

// app.post('/adminByEmail', (req, res) => {
  
//   const email = req.body.email;
//   adminMembers.find({ email: email })
//       .toArray((err, members) => {
//           // const filter = { date: date.date }
//           if (members.length === 0) {
//               email = email;
//           }
//           orderInfo.find(filter)
//               .toArray((err, documents) => {
//                   //console.log(email, doctors, documents)
//                   res.send(documents);
//               })
//       })
// })

})

app.get("/",(req,res)=>{
    res.send('db collected')
})

app.listen(process.env.PORT || port );