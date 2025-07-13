import React,{useState} from 'react'
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme
} from "@mui/material"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import {Formik} from "formik"
import * as yup from "yup"
import {useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux"
import {setLogin} from "../../state/index.js"
import  Dropzone from "react-dropzone"
import FlexBetween from "../../components/FlexBetween.jsx"
import allowOrigins from '../../allowOrigins.js'


const registerSchema = yup.object().shape({
    firstName: yup.string().required('required'),
    lastName: yup.string().required('required'),
    email: yup.string().email('invalid email').required('required'),
    password: yup.string().required('required'),
    location: yup.string().required('required'),
    occupation: yup.string().required('required'),
    picture: yup.mixed()
        .required('Picture is required')
        .test('fileSize', 'File size must be less than 10MB', (value) => {
            return value && value.size <= 10 * 1024 * 1024; // 10MB
        })
        .test('fileType', 'Only image files are allowed', (value) => {
            return value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
        })
})

const loginSchema = yup.object().shape({
    email:      yup.string().email('invalid email').required('required'),
    password :  yup.string().required('required')
})

const initialVlauesRegister={
    firstName:  "",
    lastName:   "",
    email:      "",
    password :  "",
    location:   "",
    occupation: "",
    picture :   ""
}

const initialVlauesLogin={
    email:      "",
    password :  ""
}

const Form =()=>{
    const [pageType,setPageType] =useState('login')
    const {palette} =useTheme()
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === 'login'
    const isRegister =pageType==='register'

    const register = async (values, onSubmitProps) => {
        try {
            // this allows us to send form info with image
            const formData = new FormData();
            for (let value in values) {
                formData.append(value, values[value]);
            }
            formData.append("picturePath", values.picture.name);

            const savedUserResponse = await fetch(
                `${allowOrigins}/auth/register`, // FIXED: Use allowOrigins instead of hardcoded URL
                {
                    method: "POST",
                    body: formData,
                }
            );
            
            if (!savedUserResponse.ok) {
                const errorData = await savedUserResponse.text();
                console.error('Registration failed:', errorData);
                alert('Registration failed. Please try again.');
                return;
            }
            
            const savedUser = await savedUserResponse.json();
            onSubmitProps.resetForm();

            if (savedUser) {
                setPageType("login");
                alert('Registration successful! Please login.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please check your connection and try again.');
        }
    };

    const login = async (values, onSubmitProps) => {
        try {
            const loggedInResponse = await fetch(`${allowOrigins}/auth/login`, { // FIXED: Use allowOrigins instead of hardcoded URL
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(values),
            });
            
            if (!loggedInResponse.ok) {
                const errorData = await loggedInResponse.json();
                console.error('Login failed:', errorData);
                alert('Login failed. Please check your credentials.');
                return;
            }
            
            const loggedIn = await loggedInResponse.json();
            onSubmitProps.resetForm();
            if (loggedIn) {
                dispatch(
                    setLogin({
                        user: loggedIn.user,
                        token: loggedIn.token,
                    })
                );
                navigate("/home");
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please check your connection and try again.');
        }
    };
    
    const handleFormSubmit=async (values,onSubmitProps) =>{
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await register(values, onSubmitProps);
    }



    return  (
        <Formik 
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialVlauesLogin :initialVlauesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}>

            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm
            })=>(
                <form onSubmit={handleSubmit}>
                    <Box 
                        display={"grid"}
                        gap={"30px"}
                        gridTemplateColumns={"repeat(4,minmax(0,1fr))"}
                        sx={{
                            "& > div" : {gridColumn : isNonMobile ? undefined :"span 4"}

                        }}
                        >
                            {isRegister && (
                                <>
                                    <TextField
                                        label='First Name'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.firstName}
                                        name='firstName'
                                        error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                        helperText={touched.firstName && errors.firstName}
                                        sx={{
                                            gridColumn :"span 2"
                                        }}
                                    />
                                    <TextField
                                        label='Last Name'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.lastName}
                                        name='lastName'
                                        error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                        helperText={touched.lastName && errors.lastName}
                                        sx={{
                                            gridColumn :"span 2"
                                        }}
                                    />
                                    <TextField
                                        label='Location'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.location}
                                        name='location'
                                        error={Boolean(touched.location) && Boolean(errors.location)}
                                        helperText={touched.location && errors.location}
                                        sx={{
                                            gridColumn :"span 4"
                                        }}
                                    />
                                    <TextField
                                        label='Occupation'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.occupation}
                                        name='occupation'
                                        error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                                        helperText={touched.occupation && errors.occupation}
                                        sx={{
                                            gridColumn :"span 4"
                                        }}
                                    />
                                    <Box
                                        gridColumn={"span 4"}
                                        border ={`1px solid ${palette.neutral.medium}`}
                                        borderRadius={"5px"}
                                        p={"1rem"}
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
                                                setFieldValue("picture", acceptedFiles[0]);
                                            }}
                                        >
                                            {({ getRootProps,getInputProps})=>(
                                                <Box
                                                    {...getRootProps()}
                                                    border={`2px dashed ${palette.primary.main}`}
                                                    p={"1rem"}
                                                    sx={{ "&:hover":{cursor :"pointer" }}}
                                                >
                                                    <input {...getInputProps()}/>
                                                    {!values.picture ? (
                                                        <p> Add Picture Here</p>
                                                    ) : (<FlexBetween>
                                                            <Typography>
                                                                {values.picture.name}
                                                            </Typography>
                                                            <EditOutlinedIcon/>
                                                        </FlexBetween>)}
                                                </Box>
                                            )}
                                        </Dropzone>
                                    </Box>
                                </>
                            )}

                            <TextField
                                label='Email'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name='email'
                                error={Boolean(touched.email) && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                sx={{
                                    gridColumn :"span 4"
                                }}
                            />
                            <TextField
                                label='Password'
                                type='password'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name='password'
                                error={Boolean(touched.password) && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                sx={{
                                    gridColumn :"span 4"
                                }}
                            />
                    </Box>

                    {/*  BUTTONS  */}
                    <Box

                    >
                        <Button
                            fullWidth
                            type='submit'
                            sx={{
                                m:"2rem 0",
                                p:"1rem",
                                backgroundColor:palette.primary.main,
                                color:palette.background.alt,
                                "&hover": {color :palette.primary.main} 
                            }}  
                        >
                            {isLogin? "LOGIN" : "RIGISTER"}
                        </Button>
                        <Typography
                            onClick={()=>{
                                setPageType(isLogin?"register":"login")
                                resetForm()
                            }}
                            sx={{
                                textDecoration :'underline',
                                color :palette.primary.main,
                                "&:hover": {
                                    cursor : 'pointer',
                                    color :palette.primary.light
                                }
                            }}
                        >
                            {isLogin 
                            ? " Don't have an account? Sign up here.":
                            "Already have an account? login here."
                            }
                        </Typography>
                    </Box>
                </form>
            )}        

        </Formik>
    )
}


export default Form;
