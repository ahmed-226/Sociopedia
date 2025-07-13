import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
  } from "@mui/icons-material";
  import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
  } from "@mui/material";
import FlexBetween from '../../components/FlexBetween'
import Dropzone from 'react-dropzone'
import UserImage from '../../components/UserImage'
import WidgetWrapper from '../../components/WidgetWrapper'
import { useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { setPosts } from '../../state'
import allowOrigins from "../../allowOrigins";

const MyPostWidget = ({picturePath}) => {
    const dispatch=useDispatch()
    const [isImage,setIsImage]=useState(false)
    const [image,setImage]=useState(null)
    const [post,setPost]=useState("")
    const {palette}=useTheme()
    const {_id}=useSelector((state)=>state.user)
    const token =useSelector((state)=>state.token)
    const isNonMobileScreens =useMediaQuery("(min-width:1000px")
    const  mediumMain=palette.neutral.mediumMain
    const  medium=palette.neutral.medium

    const handelPost=async()=>{
        try {
            const formData=new FormData()
            formData.append("userId",_id)
            formData.append("description",post)
            
            if(image){
                formData.append("picture",image) // Only append the file, not the name
            }

            const response=await fetch(`${allowOrigins}/posts`, // FIXED: removed .local
            {
                method :"POST",
                headers :{ Authorization: `Bearer ${token}`},
                body :formData    
            })
            
            if (!response.ok) {
                console.error('Failed to create post:', response.status);
                alert('Failed to create post. Please try again.');
                return;
            }
            
            const posts=await response.json()
            dispatch(setPosts({posts}))
            setImage(null)
            setPost("")
            setIsImage(false) // Close the image upload area
            
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please check your connection.');
        }
    }
    
  return (
    <WidgetWrapper>
        <FlexBetween gap={"1.5rem"}>
            <UserImage image={picturePath}/>
            <InputBase 
                placeholder='What is on your mind...'
                onChange={(e)=>setPost(e.target.value)}
                value={post}
                sx={{
                    width:"100%",
                    backgroundColor :palette.neutral.light ,
                    borderRadius :"2rem",
                    padding:"1rem 2rem"
                }}
                />
        </FlexBetween>
        {isImage && (
            <Box 
                border={`1px solid ${medium}`}
                borderRadius={'5px'}
                mt={'1rem'}
                p={'1rem'}
            >
                <Dropzone
                    acceptedFiles=".jpg, .png, .jpeg"
                    multiple={false}
                    maxSize={10 * 1024 * 1024} // 10MB limit
                    onDrop={(acceptedFiles, rejectedFiles) => {
                        if (rejectedFiles.length > 0) {
                            alert(`File rejected: ${rejectedFiles[0].errors[0].message}`);
                            return;
                        }
                        setImage(acceptedFiles[0]);
                    }}
                >
                    {({ getRootProps,getInputProps})=>(
                        <FlexBetween>

                        <Box
                            {...getRootProps()}
                            border={`2px dashed ${palette.primary.main}`}
                            p={"1rem"}
                            width={"100%"}
                            sx={{ "&:hover":{cursor :"pointer" }}}
                            >
                            <input {...getInputProps()}/>
                            {!image ? (
                                <p> Add Picture Here</p>
                                ) : (<FlexBetween>
                                    <Typography>
                                        {image.name}
                                    </Typography>
                                    <EditOutlined/>
                                </FlexBetween>)}
                        </Box>
                        {image && (
                            <IconButton 
                            onClick={()=>setImage(null)}
                            sx={{width:"15%"}}
                            >
                            <DeleteOutlined/>
                            </IconButton>
                        )}
                        </FlexBetween>
                    )}
                </Dropzone>
            </Box>
        )}

        <Divider sx={{ margin:"1.25rem 0"}}/>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <FlexBetween 
                gap={'0.25rem'}
                onClick={()=> setIsImage(!isImage)}
                >
                    <ImageOutlined sx={{color :mediumMain}}/>
                    <Typography 
                        color={mediumMain}
                        sx={{
                            "&:hover":{
                                cursor:"pointer",
                                color :medium
                            }
                        }}
                    >
                        Image
                    </Typography>
                </FlexBetween>


                <Button 
                    disabled={!post}
                    onClick={handelPost}
                    
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        borderRadius: "3rem",
                    }}
                >
                    POST
                </Button>
        </Box>
    </WidgetWrapper>
  )
}

export default MyPostWidget