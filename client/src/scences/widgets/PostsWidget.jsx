import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index.js";
import PostWidget from "./PostWidget.jsx";
import allowOrigins from "../../allowOrigins.js";

const PostsWidget = ({ userId, isProfile = false }) => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);
    const token = useSelector((state) => state.token);

    const getPosts = async () => {
        try {
            const response = await fetch(`${allowOrigins}/posts`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (!response.ok) {
                console.error('Failed to fetch posts:', response.status);
                return;
            }
            
            const data = await response.json();
            console.log('Posts data received:', data);
            dispatch(setPosts({ posts: data }));
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const getUserPosts = async () => {
        try {
            const response = await fetch(
                `${allowOrigins}/posts/${userId}/posts`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            
            if (!response.ok) {
                console.error('Failed to fetch user posts:', response.status);
                return;
            }
            
            const data = await response.json();
            console.log('User posts data received:', data);
            dispatch(setPosts({ posts: data }));
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

    useEffect(() => {
        if (isProfile) {
            getUserPosts();
        } else {
            getPosts();
        }
    }, []);

    // Add safety check for posts array
    if (!posts || !Array.isArray(posts)) {
        return <div>Loading posts...</div>;
    }

    return (
        <>
            {posts.map((post) => {
                // Ensure all required properties exist with defaults
                const safePost = {
                    _id: post._id,
                    userId: post.userId,
                    firstName: post.firstName || 'Unknown',
                    lastName: post.lastName || 'User',
                    description: post.description || '',
                    location: post.location || '',
                    picturePath: post.picturePath,
                    userPicturePath: post.userPicturePath,
                    likes: post.likes || {},
                    comments: post.comments || [],
                };

                return (
                    <PostWidget
                        key={safePost._id}
                        postId={safePost._id}
                        postUserId={safePost.userId}
                        name={`${safePost.firstName} ${safePost.lastName}`}
                        description={safePost.description}
                        location={safePost.location}
                        picturePath={safePost.picturePath}
                        userPicturePath={safePost.userPicturePath}
                        likes={safePost.likes}
                        comments={safePost.comments}
                    />
                );
            })}
        </>
    );
};

export default PostsWidget;