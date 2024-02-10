import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url'; 
import authRouters from './Routes/auth.route.js'
import userRouters from './Routes/users.route.js'
import postRouters from './Routes/posts.route.js'
import { register } from './controllers/auth.controller.js';
import {createPost} from './controllers/posts.controller.js'
import { verifyToken } from './middleware/auth.middleware.js';
import User from './models/User.js';
import Post from './models/Post.js';
import {users,posts} from "./data/index.js"
import corsOptions from "./config/corsOptions.js"




// CONFIGURATIONS

const __file_name = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__file_name);
dotenv.config();
const app= express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors({
//     origin: 'https://sociopedia-71et.onrender.com',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   },));
app.use(cors(corsOptions))
app.use('/assets', express.static(path.join(__dirname,'public/assets')))

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public/assets")
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
})

const upload =multer({storage});

// ROUTER WITH FILES 

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES

app.use('/auth',authRouters)
app.use('/users',userRouters)
app.use("/posts",postRouters)

// mongoose settings 

const PORT =process.env.PORT || 4001;
mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then (()=>{
    app.listen(PORT,()=> console.log(`server port listening on : ${PORT}`))

    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error)=> console.log(`${error} did not connect`))
