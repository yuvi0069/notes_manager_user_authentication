const mongoose=require ("mongoose");
mongoose.connect("mongodb+srv://yuviabhi00:yuviabhi00@cluster0.264cezt.mongodb.net/");
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
       type:String,
       require:true,
       unique:true
    },
    password:{
        type:String
    }
})
const NotesSchema=new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    title:{
    type:String,
    require:true,
    },
    desc:{
        type:String,
        require:true
    },
    tag:{
          type:String,
          default:'General'
    }
})
const User=new mongoose.model("user",UserSchema);
const Notes=new mongoose.model("notes",NotesSchema);
module.exports={
    User,
    Notes
}