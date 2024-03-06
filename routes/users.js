const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/', async (req, res) => {
    try{
        const users = await User.find()
        res.send(users)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

router.get('/:id', getUser, (req, res) => {
    res.send(res.user.name)
})

router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        userOf: req.body.userOf
    })
     try{
        const newUser = await user.save()
        res.status(201).send(newUser)
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.patch('/:id', getUser, async (req, res) => {
    if (req.body.name != null) {
        res.user.name = req.body.name
    }
    if (req.body.userOf != null) {
        res.user.userOf = req.body.userOf
    }
    try{
        const updatedUser = await res.user.save()
        res.status(201).send(updatedUser)
    }catch(err){
        res.status(400).json({message: err.message})
    }
})

router.delete('/:id', getUser, async(req, res) => {
    try{
        await res.user.deleteOne()
        res.json({message: 'Deleted'})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

async function getUser(req, res, next) {
    let user
    try{
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({message : 'Cannot find User'})
        }
    } catch (err){
        res.status(500).json({message: err.message})
    }
    res.user = user
    next()
}
 
module.exports = router