require('dotenv').config()
const express = require('express');
const { connectionToDb } = require('./config/user.dbConfig');
const { userRouter } = require('./router/user.router');
const { notesRouter } = require('./router/note.router');
const app = express();
const port = process.env.PORT
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("this is home");
})

app.use("/user",userRouter)
app.use("/note",notesRouter)


app.listen(port, async()=>{
    try {
        await connectionToDb();
        console.log(`server is running on port ${port}`)

    } catch (error) {
       console.error("unable to port") 
    }
})