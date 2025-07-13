import Post from "../models/Post.js";
import User from "../models/User.js";

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, comment } = req.body;

    // Validate input
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ status: "ERROR", message: "User not found" });
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create new comment object
    const newComment = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.picturePath,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    // Add comment to post
    post.comments.push(newComment);
    await post.save();

    // Return the updated post
    const updatedPost = await Post.findById(postId);
    res.status(201).json(updatedPost);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, comment } = req.body;

    // Validate input
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Find the comment
    const commentToUpdate = post.comments.id(commentId);
    if (!commentToUpdate) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if user owns the comment
    if (commentToUpdate.userId !== userId) {
      return res.status(403).json({ error: "You can only edit your own comments" });
    }

    // Update the comment
    commentToUpdate.comment = comment.trim();
    commentToUpdate.updatedAt = new Date();

    await post.save();

    // Return the updated post
    const updatedPost = await Post.findById(postId);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Find the comment
    const commentToDelete = post.comments.id(commentId);
    if (!commentToDelete) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if user owns the comment
    if (commentToDelete.userId !== userId) {
      return res.status(403).json({ error: "You can only delete your own comments" });
    }

    // Remove the comment
    post.comments.pull(commentId);
    await post.save();

    // Return the updated post
    const updatedPost = await Post.findById(postId);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: error.message });
  }
};