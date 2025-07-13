import { Box, Typography, useTheme } from "@mui/material"
import Friend from "../../components/Friend"
import WidgetWrapper from "../../components/WidgetWrapper"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setFriends } from "../../state"
import allowOrigins from "../../allowOrigins"

const FriendsListWidget = ({ userId }) => {

  const dispatch = useDispatch()
  const { palette } = useTheme()
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user?.friends || []); // Add safety check

  const getFriends = async () => {
    try {
      const response = await fetch(
        `${allowOrigins}/users/${userId}/friends`, // FIXED: removed .local
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      if (!response.ok) {
        console.error('Failed to fetch friends:', response.status);
        return;
      }
      
      const data = await response.json()
      console.log('Friends data received:', data); // Debug log
      dispatch(setFriends({ friends: data }))
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }

  useEffect(() => {
    if (userId && token) { // Add checks before fetching
      getFriends()
    }
  }, [userId, token]) // Add dependencies

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends && friends.length > 0 ? (
          friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
            />
          ))
        ) : (
          <Typography color={palette.neutral.medium}>
            No friends yet
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  )
}

export default FriendsListWidget