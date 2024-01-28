import express from 'express';
import {getFeedPosts,getUserPosts,likePost} from "../controllers/posts.controller.js"
import { verifyToken } from '../middleware/auth.middleware.js';


const router=express.Router();


// READ 

router.get("/",getFeedPosts);
router.get("/:userId/posts",getUserPosts);

// UPDATE 

router.patch("/:id/like",likePost);

export default router;
