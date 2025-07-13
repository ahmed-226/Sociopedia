import express from 'express';
import { addComment, updateComment, deleteComment, getComments } from '../controllers/comments.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET comments for a post
router.get("/:postId/comments", verifyToken, getComments);

// POST a new comment
router.post("/:postId/comments", verifyToken, addComment);

// PUT (update) a comment
router.put("/:postId/comments/:commentId", verifyToken, updateComment);

// DELETE a comment
router.delete("/:postId/comments/:commentId", verifyToken, deleteComment);

export default router;