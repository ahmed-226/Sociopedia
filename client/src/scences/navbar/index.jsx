import React from 'react'
import { useState } from 'react'
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery
} from "@mui/material"
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close
} from "@mui/icons-material"
import {useSelector, useDispatch} from "react-redux"
import {useNavigate} from "react-router-dom"
import {setMode ,setLogout } from "../../state/index"
import FlexBetween from '../../components/FlexBetween'

const Navbar = () => {

  const  [IsMobileMenuToggle,setIsMobileMenuToggle] =useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user=useSelector((state)=> state.user)
  const isNonMobileScreens=useMediaQuery("(min-width:1000px")

  const theme=useTheme() 
  const neutralLigth =theme.palette.neutral.light
  const dark= theme.palette.neutral.dark
  const background =theme.palette.background.default
  const primaryLight=theme.palette.primary.light
  const alt=theme.palette.background.alt

  const fullName=`${user.firstName} ${user.lastName}`

  return (
    <FlexBetween padding="1rem 6%" backgroundcolor={alt} >
      <FlexBetween  gap="1.75rem">
        <Typography 
          fontWeight="bold"
          fontSize="clamp(1rem,2rem,2.25rem)"
          color="primary"
          onClick={()=>navigate("/home")}
          sx={{
            "&:hover":{
              color: primaryLight,
              cursor:"pointer"
            }
          }}
        >
          Sociopedia
        </Typography>  
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLigth}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase placeholder='Search...'>
              <IconButton>
                <Search/>
              </IconButton>
            </InputBase>
            
          </FlexBetween>
        )}
        </FlexBetween>
        
        {/* DESKTOP NAV */}
        { 
          isNonMobileScreens ? (
            <FlexBetween gap="2rem">
              <IconButton onClick={()=>dispatch(setMode())}>
              {theme.palette.mode ==="dark" ? (
                <DarkMode sx={{fontSize:"25px"}} />
              ) : (
                <LightMode sx={{fontSize:"25px"}}/>
              )}
              </IconButton>
              <FormControl variant="standard"
               value={fullName}
               >
              <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLigth,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLigth,
                },
              }}
              input={<InputBase />}
              >
                <MenuItem 
                value={fullName}
                >
                  <Typography>
                    {fullName}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
              </Select>
              </FormControl>
            </FlexBetween>
          ) : 
          (
            <IconButton
              onClick={() => setIsMobileMenuToggle(!IsMobileMenuToggle)}
            >
              <Menu />
            </IconButton>
          )
          }

          {/* MOBILE NAV */}
          { !isNonMobileScreens && IsMobileMenuToggle && (
            <Box
                position="fixed"
                right="0"
                bottom="0"
                height="100%"
                zIndex="10"
                maxWidth="500px"
                minWidth="300px"
                backgroundColor={background}
            >
              <Box display="flex" justifyContent="flex-end" p="1rem">
                <IconButton
                  onClick={() => setIsMobileMenuToggle(!IsMobileMenuToggle)}
                >
                  <Close/>
                </IconButton>
              </Box>

              {/* MENU ITEMS  */}
              <FlexBetween 
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  gap="3rem"
                  >
                <IconButton onClick={() => dispatch(setMode())} sx={{ fontSize: "25px" }}  >
                  {theme.palette.mode === "dark" ? (
                    <DarkMode sx={{ fontSize: "25px" }} />
                  ) : (
                    <LightMode sx={{ color: dark, fontSize: "25px" }} />
                  )}
                </IconButton>
                <Message sx={{ fontSize: "25px" }} />
                <Notifications sx={{ fontSize: "25px" }} />
                <Help sx={{ fontSize: "25px" }} />
                <FormControl variant="standard" 
                value={fullName}
                >
                  <Select
                    value={fullName}
                    sx={{
                      backgroundColor: neutralLigth,
                      width: "150px",
                      borderRadius: "0.25rem",
                      p: "0.25rem 1rem",
                      "& .MuiSvgIcon-root": {
                        pr: "0.25rem",
                        width: "3rem",
                      },
                      "& .MuiSelect-select:focus": {
                        backgroundColor: neutralLigth
                      },
                    }}
                    input={<InputBase />}
                  >
                    <MenuItem 
                    value={fullName}
                    >
                      <Typography>
                        {fullName}
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                  </Select>
                </FormControl>
              </FlexBetween>
            </Box>
            )
          }

      </FlexBetween>
  )
}

export default Navbar
