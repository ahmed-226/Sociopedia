import { Box, useMediaQuery } from '@mui/material'
import React from 'react'
import Navbar from '../navbar/index.jsx'
import { useSelector } from 'react-redux'
import UserWidget from '../widgets/UserWidget.jsx'
import MyPostWidget from '../widgets/MyPostWidget.jsx'
import PostsWidget from '../widgets/PostsWidget.jsx'

const HomePage = () => {

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)")
  const { _id, picturePath } = useSelector((state) => state.user)

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} PicturePath={picturePath} />
        </Box>
        <Box 
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath}/>
          <PostsWidget userId={_id}/>
        </Box>
        {isNonMobileScreens && (<Box flexBasis={"26%"}></Box>)}
      </Box>
    </Box>
  )
}

export default HomePage
