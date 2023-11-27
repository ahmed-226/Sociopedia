import User from "../models/User.js";


export const getUser=async (req,res) => {

    try {

        const {id}=await req.params;
        const user=await User.findById(id);

        res.status(200).json({status:'SUCCESS',user : user});

    }catch(e) {

        res.status(404).json({status: " ERRROR", message: e.message});

    }

}

export const getUserFriend =async (req,res) => {

    try {

        const {id}=await req.params;
        const user=await User.findById(id);

        const friends=await Promise.all(
            user.friends.map((id)=> User.findById(id))
        )
        const formattedFreinds=friends.map(
            ({id,firstName,lastName,occupation,location,picturePath})=>{
                return {id,firstName,lastName,occupation,location,picturePath};
            }
        )
        res.status(200).json({status :"SUCCESS",data :formattedFreinds});

    }catch(e) {

        res.status(404).json({status: " ERRROR", message: e});

    }

}

export const addRemoveFriend =async (req,res)=>{

    try{

        const {id,friendId}=req.params;
        const user=await User.findById(id);
        const friend=await User.findById(friendId);

        if(user.friends.includes(friendId)){
            user.friends=user.friends.filter((id)=> id!== friendId);
            friend.friends=firend.friends.filter((id)=> id!== id);
        }else{
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends=await Promise.all(
            user.friends.map((id)=> User.findById(id))
        )
        const formattedFreinds=friends.map(
            ({id,firstName,lastName,occupation,location,picturePath})=>{
                return {id,firstName,lastName,occupation,location,picturePath};
            }
        )

        res.staus(404).json({status:"SUCCESS",data : {friends:formattedFreinds}});

    }catch(e){

        res.status(404).json({status: " ERRROR", message: e});

    }

}