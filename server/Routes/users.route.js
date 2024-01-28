import express from 'express';
import {getUser,getUserFriend,addRemoveFriend} from "../controllers/users.controller.js";
import  {verifyToken}from "../middleware/auth.middleware.js";


const router=express.Router();


// READ

router.get("/:id",getUser);
router.get("/:id/friends",getUserFriend);

// UPDATE

router.patch("/:id/:friendId",addRemoveFriend);


export default router;