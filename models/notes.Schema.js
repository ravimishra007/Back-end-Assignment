const mongoose = require('mongoose')

const notesSchema = new mongoose.Schema({
    author:String,
    title:String,
    body:String,
    userId:String,
    username:String
})

const notesModel = mongoose.model("notes",notesSchema)

module.exports = {notesModel}