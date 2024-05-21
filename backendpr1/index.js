const express=require ("express");
const cors=require("cors");
const bodyParser = require('body-parser');
const user=require("./routes/user")
const notes=require('./routes/notes')
const app=express();
app.use(bodyParser.json());
app.use(cors());
app.use("/user",user);
app.use("/notes",notes);
const PORT=5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});