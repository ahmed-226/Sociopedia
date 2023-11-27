import mongoose from "mongoose";

const PostSchema=new mongoose.Schema({

        userId:{
            type:String,
            required : true,
        },
        firstName :{
            type : String,
            required : true,
        },
        lastName :{
            type : String,
            required : true,
        },
        like:{
            type:Map,
            of :Boolean
        },
        comments:{
            type:Array,
            default:[]
        },
        picturePath :{
            type : String
        },
        location :{
            type : String
        },
        description:{
            type : String
        },
        userPicturePath :{
            type : String
        }
    
    },
    {timestamps : true}
    
)

const Post=mongoose.model('Post',PostSchema);

export default Post;
