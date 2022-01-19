var express = require('express');
var router = express.Router();
var User = require('../models/user');

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

// ========================== End Mongodb API ==========================

//export this router to use in our index.js
module.exports = router;