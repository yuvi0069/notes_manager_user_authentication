const express=require('express');
const jwt=require('jsonwebtoken');
const usermiddleware = require('../middlwares/usermiddleware');
const { Notes } = require('../table/db');
const route=express.Router();
route.get('/getall',usermiddleware,async(req,res)=>{
    try{
    const notes=await Notes.find({user:req.user.id})
    res.json(notes);
}
    catch(error)
    {
        res.send("notes not available");
    }
})
route.post('/add',usermiddleware,async(req,res)=>{
    try{
    
    const notes=await Notes.create({
        user:req.user.id,
       title: req.body.title,
        desc:req.body.desc,
        tag:req.body.tag
    })
    res.json(notes);
}
    catch(error)
    {
        res.json({msg:"Server error"});
    }
})
route.put('/updatenote/:id', usermiddleware, async (req, res) => {
    const { title, desc, tag } = req.body;
    try {
      
        const newNote = {};
        if (title) { newNote.title = title };
        if (desc) { newNote.desc = desc };
        if (tag) { newNote.tag = tag };

       
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

route.delete('/deletenote/:id',usermiddleware, async (req, res) => {
    try {
   
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports=route;