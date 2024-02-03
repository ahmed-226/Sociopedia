import { Box,useMediaQuery } from '@mui/material'
import { useEffect,useState } from 'react'
import {  useSelector } from 'react-redux/es/hooks/useSelector'
import { useParams } from 'react-router-dom'
import Navbar from '../navbar'
import FriendsListWidget from '../widgets/FriendsListWidget'
import MyPostWidget from '../widgets/MyPostWidget'
import PostsWidget from '../widgets/PostsWidget'
import UserWidget from '../widgets/UserWidget'
import allowOrigins from '../../allowOrigins'

const ProfilePage = () => {

  const [user,setUser]=useState(null)
  const {userId}=useParams()
  console.log(userId);
  const token = useSelector((state) => state.token)
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)")

  const getUser=async ()=> {

    const resopnse=await fetch(`${allowOrigins.netlify}/users/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data=await resopnse.json()
      setUser(data)

  }

  useEffect(()=>{
    getUser()
  },[])

  if(!user) return "profile page"

  return (
    <Box>
      <Navbar/>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%":undefined}>
          <UserWidget userId={userId} PicturePath={user.picturePath}/>
          <Box m={"2rem 0"}/>
          <FriendsListWidget userId={userId}/>
        </Box>
        <Box flexBasis={isNonMobileScreens ? "42%":undefined} 
          mt={isNonMobileScreens ? undefined : "2rem"}>
            <MyPostWidget picturePath={user.picturePath}/>
            <Box m={"2rem 0"}/>
            <PostsWidget userId={userId} isProfile/>
          </Box>
      </Box>
    </Box>
    
  )
}

export default ProfilePage
