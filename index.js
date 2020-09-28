const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const ObjectId = require('mongodb').ObjectId;
const password = "YzUp2vNuU48PlwLr";
const user = "user_todo"

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://user_todo:YzUp2vNuU48PlwLr@cluster0.gdwvc.mongodb.net/db_todo?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("db_todo").collection("collection_todo");
    console.log("db connected")

    // ----- API START

    app.post('/postData', (req,res)=>{ // --------------------------- POST API
        const item = req.body;
        console.log(item)
        collection.insertOne(item)
        .then(result =>{
            console.log('data inserted', result)
            res.redirect('/')
        })
    })

    app.get('/getAllData', (req,res)=>{ // --------------------------- GET API for all data
        collection.find({})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })

    app.get('/loadToUpdate/:id', (req, res)=>{ // --------------------------- GET API to load single data for update
        collection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents)=>{
            res.send(documents[0])
        })
    })

    app.patch('/update/:id', (req,res)=>{ // --------------------------- UPDATE API
        collection.updateOne(
            {_id: ObjectId(req.params.id)},
            {
                $set : {title: req.body.title, details: req.body.details},
                $currentDate: {"lastModified":true}
            }
        )
        .then(result =>{
            res.send(result.modifiedCount > 0)
        })
    })

    app.delete('/delete/:id' , (req,res)=>{ // --------------------------DELETE API
        collection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result =>{
            res.send(result.deletedCount > 0)
        })
    })

    // ----- API END
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.listen(3000)