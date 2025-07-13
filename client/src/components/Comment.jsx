import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CancelOutlined,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { setPost } from "../state/index.js";
import FlexBetween from "./FlexBetween.jsx";
import UserImage from "./UserImage.jsx";
import allowOrigins from "../allowOrigins.js";

const Comment = ({ comment, postId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment?.comment || "");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  
  // Handle undefined comment
  if (!comment) {
    return null;
  }
  
  const isOwnComment = comment.userId === loggedInUserId;

  const handleEdit = async () => {
    if (editedComment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `${allowOrigins}/posts/${postId}/comments/${comment._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            comment: editedComment,
          }),
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to update comment:', errorData);
        alert("Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Error updating comment");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const response = await fetch(
          `${allowOrigins}/posts/${postId}/comments/${comment._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: loggedInUserId,
            }),
          }
        );

        if (response.ok) {
          const updatedPost = await response.json();
          dispatch(setPost({ post: updatedPost }));
        } else {
          const errorData = await response.json();
          console.error('Failed to delete comment:', errorData);
          alert("Failed to delete comment");
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Error deleting comment");
      }
    }
  };

  const handleCancel = () => {
    setEditedComment(comment.comment);
    setIsEditing(false);
  };

  return (
    <Box sx={{ mb: "0.5rem" }}>
      <FlexBetween>
        <FlexBetween gap="0.5rem" sx={{ flex: 1 }}>
          <UserImage image={comment.userPicturePath} size="30px" />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              color={palette.neutral.main}
              fontWeight="bold"
            >
              {comment.firstName} {comment.lastName}
            </Typography>
            {isEditing ? (
              <Box sx={{ mt: "0.25rem" }}>
                <TextField
                  fullWidth
                  multiline
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <Box sx={{ mt: "0.5rem", display: "flex", gap: "0.5rem" }}>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<SaveOutlined />}
                    onClick={handleEdit}
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CancelOutlined />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography
                variant="body2"
                color={palette.neutral.main}
                sx={{ mt: "0.25rem" }}
              >
                {comment.comment}
              </Typography>
            )}
          </Box>
        </FlexBetween>
        {isOwnComment && !isEditing && (
          <Box>
            <IconButton size="small" onClick={() => setIsEditing(true)}>
              <EditOutlined fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleDelete}>
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Box>
        )}
      </FlexBetween>
    </Box>
  );
};

export default Comment;