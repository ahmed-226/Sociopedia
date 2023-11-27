import express from 'express';
import {getUser,getUserFriend,addRemoveFriend} from "../controllers/users.controller.js";
import  {verifyToken}from "../middleware/auth.middleware.js";


const router=express.Router();


// READ

router.get("/:id",verifyToken,getUser);
router.get("/:id/friends",verifyToken,getUserFriend);

// UPDATE

router.patch("/:id/:friendId",verifyToken,addRemoveFriend);


export default router;