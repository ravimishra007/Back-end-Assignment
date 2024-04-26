const express = require('express');
const { auth } = require('../middleware/authMilddleaware');
const { notesModel } = require('../models/notes.Schema');
const notesRouter = express.Router();

// post the data
notesRouter.post('/add',auth, async(req,res)=>{
try {
    const note = new notesModel(req.body)
    await note.save();
    return res.status(200).json({msg:"a new note has been added",note})
} catch (error) {
    console.error(error);
    return res.status(500).json({error:true,msg:"unable to add the data"})

}
})

// get the data
notesRouter.get('/users',auth, async(req,res)=>{
    try {
        const users = await notesModel.find()
        return res.status(200).json({error:false,items:users})
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:true,msg:"unable to getting the data.."})

    }

})

// update the data
notesRouter.post('/update/:id',auth, async(req,res)=>{
    const{author,title,body}= req.body;
    try {
        const note = await notesModel.findById(req.params.id)
        if(!note){
            console.log("note not found")
            return res.status(404).json({error:true,msg:"note not found"})
        }
        if (note.userId = req.body.userId){
            const newNote = await userModel.findByIdAndUpdate({_id:req.params.id},req.body)
            return res.status(404).json({error:true,msg:"updated successfully", newNote})

        }
        
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:true,msg:"unable to update"})
    
    }
    
})


// delete the data
notesRouter.post('/update/:id',auth, async(req,res)=>{
    const{author,title,body}= req.body;
    try {
        const note = await notesModel.findById(req.params.id)
        if(!note){
            console.log("note not found")
            return res.status(404).json({error:true,msg:"note not found"})
        }
        if (note.userId = req.body.userId){
            const newNote = await userModel.findByIdAndDelete({_id:req.params.id},req.body)
            return res.status(404).json({error:true,msg:"deleted successfully", newNote})

        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:true,msg:"unable to delete"})
    
    }
    
})


module.exports = {
    notesRouter
}