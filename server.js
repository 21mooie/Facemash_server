var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');



var User = require('./models/User.js');
var auth = require('./auth.js')
var Post = require('./models/Post.js')
mongoose.Promise=Promise

var posts=[
    {message: 'hello'},
    {message: 'hi'},
];

app.use(cors());
app.use(bodyParser.json());

app.get('/posts', (req,res) => {
    res.send(posts);
});

app.post('/post', (req,res) => {
    var post = new Post(req.body);

    post.save((err,result) => {
        if(err){
            console.error('saving post error');
            return res.status(500).send({message: 'saving post error'})
        }
        res.sendStatus(200);    
    })
})

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

app.get('/profile/:id', async (req,res) => {
    try{
        var user = await User.findById(req.params.id, '-pwd -__v')
        res.send(user);
    }
    catch (error){
        console.error(error);
        res.sendStatus(500);
    }   
});


mongoose.connect('mongodb://test:test@ds115768.mlab.com:15768/face_smash', (err) => {
    if (!err){
        console.log('connected to mongo');
    }
});

app.use('/auth', auth)

app.listen(3000);