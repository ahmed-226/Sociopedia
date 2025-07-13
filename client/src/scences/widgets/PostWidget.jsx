import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  SendOutlined,
} from "@mui/icons-material";
import { 
  Box, 
  Divider, 
  IconButton, 
  Typography, 
  useTheme, 
  TextField,
  Button 
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween.jsx";
import Friend from "../../components/Friend.jsx";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import Comment from "../../components/Comment.jsx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state/index.js";
import allowOrigins from "../../allowOrigins.js";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes = {}, // Default to empty object
  comments = [], // Default to empty array
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  
  // Safe access to likes with fallback
  const safeLikes = likes || {};
  const isLiked = Boolean(safeLikes[loggedInUserId]);
  const likeCount = Object.keys(safeLikes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLikes = async () => {
    try {
      const response = await fetch(`${allowOrigins}/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: loggedInUserId })
      });

      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
      } else {
        console.error('Failed to update likes:', response.status);
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `${allowOrigins}/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            comment: newComment,
          }),
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
        setNewComment("");
      } else {
        const errorData = await response.json();
        console.error('Failed to add comment:', errorData);
        alert('Failed to add comment');
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Error adding comment");
    }
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width={"100%"}
          alt={"post"}
          height={"auto"}
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${allowOrigins}/assets/${picturePath}`}
          onError={handleImageError}
        />
      )}
      <FlexBetween mt={"0.25rem"}>
        <FlexBetween gap={"1rem"}>
          <FlexBetween gap={"0.3rem"}>
            <IconButton onClick={patchLikes}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap={"0.3rem"}>
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments ? comments.length : 0}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt={"0.5rem"}>
          <Divider />
          
          {/* Add Comment Section */}
          <Box sx={{ mt: "1rem", mb: "1rem" }}>
            <FlexBetween gap="0.5rem">
              <TextField
                fullWidth
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
                size="small"
                multiline
                maxRows={3}
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                startIcon={<SendOutlined />}
                disabled={newComment.trim() === ""}
              >
                Post
              </Button>
            </FlexBetween>
          </Box>

          <Divider />

          {/* Comments List */}
          <Box sx={{ mt: "1rem" }}>
            {comments && comments.length > 0 ? (
              comments.map((comment, index) => (
                <Comment
                  key={comment._id || `comment-${index}`}
                  comment={comment}
                  postId={postId}
                />
              ))
            ) : (
              <Typography color={palette.neutral.medium} sx={{ textAlign: 'center', mt: '1rem' }}>
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;