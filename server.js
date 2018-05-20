var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');

var User = require('./models/User.js');

var posts=[
    {message: 'hello'},
    {message: 'hi'},
];

app.use(cors());
app.use(bodyParser.json());

app.get('/posts', (req,res) => {
    res.send(posts);
});

app.get('/users', async (req,res) => {
    try{
        var users = await User.find({}, '-pwd -__v')
        res.send(users);
    }
    catch (error){
        console.error(error);
        res.sendStatus(500);
    }   
    
});

app.post('/register', (req,res) => {
    var userData = req.body;

    var user = new User(userData);
    user.save((err,result) => {
        if(err){
            console.log('saving user error');
        }
        res.sendStatus(200);    
    })
    //console.log(userData.email);
    
});

app.post('/login', async (req,res) => {
    var userData = req.body;

    var user = await User.findOne({email: userData.email})

    if (!user)
        return res.status(401).send({message: "Email or Password invalid"})

    if (userData.pwd != user.pwd)
        return res.status(401).send({message: "Email or Password invalid"})    
    
    var payload = {};
    
    var token = jwt.encode(payload, '123');
    console.log(token)

    res.status(200).send({token})
});

mongoose.connect('mongodb://test:test@ds115768.mlab.com:15768/face_smash', (err) => {
    if (!err){
        console.log('connected to mongo');
    }
});

app.listen(3000);