const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchuser=require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');


//ROUTE 1: Get all the notes using: GET "/api/notes/getuser".  Login required
router.get('/fetchallnotes',fetchuser , async (req, res)=>{
    try {
        const notes= await Note.find({user: req.user.id})
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }

    
})

//ROUTE 2: Add a new note using: POST "/api/notes/addnote".  Login required
router.post('/addnote',fetchuser , [
    body('title','enter a valid title').isLength({min: 3}),
    body('description','enter a valid description').isLength({min: 5})
   
] , async (req, res)=>{
    const {title,description,tag}=req.body;
    try {
        //If there are errors, then show the error
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const note= new Note({
        title, description, tag, user: req.user.id
    })
    const savedNote=await note.save()
    res.json(savedNote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
    }
    
})

//ROUTE 3: Update an existing note using: PUT "/api/notes/updatenote".  Login required
router.put('/updatenote/:id',fetchuser ,  async (req, res)=>{
    try {
        const {title, description,tag}=req.body;
        //Create a newnote object
        const newNote={};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        //find the note to be updated and update it
        let note=await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note= await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
        res.json({note});
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
    }
    
    
})

//ROUTE 4: Delete an existing note using: DELETE "/api/notes/deletenote".  Login required
router.delete('/deletenote/:id',fetchuser ,  async (req, res)=>{
    try {
        const {title, description,tag}=req.body;
        

        //find the note to be deleted and delete it
        let note=await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}

        //Allows deletion only if user owns the note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note= await Note.findByIdAndDelete(req.params.id)
        res.json({"Success": "Note has been deleted"});
        
        
            
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
    }
    
})


module.exports = router