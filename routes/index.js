var express = require('express');
var router = express.Router();
var User = require('../models/user');
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

router.get('/', (req,res) => {
    res.send('ini adalah example route');
})

// ========================== Begin Mongodb API ==========================
router.get('/mongodb/getUsers', async(req,res) => {
    try{
        const resBody = await User.find()
        res.json(resBody);
    }catch(err){
        res.json({message: err});
    }
});

router.get('/mongodb/:id', async(req,res) => {
    try{
        const resBody = await User.findOne({ _id: req.params.id })
        res.json(resBody);
    }catch(err){
        res.json({message: err});
    }
});

router.post('/mongodb/addUser', async(req,res) => {
    const postData = new User({
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        email: req.body.email
    })

    try{
        const resBody = await postData.save()
        res.json(resBody);
    }catch(err){
        res.json({message: err});
    }
});


router.put('/mongodb/:id',async(req,res) => {
    try{
        const resBody = await User.updateOne({_id: req.params.id},{
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            email: req.body.email
        })
        res.json(resBody);
    }catch(err){
        res.json({message: err});
    }
});

router.delete('/mongodb/:id', async(req,res) => {
    try{
        const resBody = await User.deleteOne({_id:req.params.id})
        res.json(resBody);
    }catch(err){
        res.json({message: err});
    }
});


// Register
router.post("/mongodb/register", async (req, res) => {
    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400)
                .send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409)
                      .send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            firstName: first_name,
            lastName: last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
  } catch (err) {
        console.log(err);
  }
});

// Login
router.post("/mongodb/login", async (req, res) => {
    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;
        console.log('first name:', process.env.TOKEN_KEY);

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { 
                    user_id: user._id, email 
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
});

router.get("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});


// ========================== End Mongodb API ==========================

//export this router to use in our index.js
module.exports = router;