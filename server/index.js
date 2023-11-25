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
// import authRouters from './Routes/auth.js'
import { register } from './controllers/auth.controller.js';



// CONFIGURATIONS

const __file_name = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__file_name);
dotenv.config();
const app= express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));
app.use(morgan('common'));
app.use(bodyParser.json({limit :"30mb" ,extended :true}));
app.use(bodyParser.urlencoded({limit :'30mb',extended:true}));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname,'public/assets')))

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/assests')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
})

const upload =multer({storage});

app.post('/auth/register',upload.single('picture'),register)

// app.use('/auth',authRouters)

// mongoose settings 

const PORT =process.env.PORT || 4001;
mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then (()=>{
    app.listen(PORT,()=> console.log(`server port listening on : ${PORT}`))
}).catch((error)=> console.log(`${error} did not connect`))
