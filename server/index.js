import fs from 'fs';
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
import advertisementRouters from './Routes/advertisements.route.js' 
import Advertisement from './models/Advertisement.js'; 
import commentRouters from './Routes/comments.route.js'
import { register } from './controllers/auth.controller.js';
import {createPost} from './controllers/posts.controller.js'
import { verifyToken } from './middleware/auth.middleware.js';
import User from './models/User.js';
import Post from './models/Post.js';
import {users,posts} from "./data/index.js" 
import corsOptions from "./config/corsOptions.js"
import { seedDatabase } from './utils/seedDatabase.js';



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
app.use(cors(corsOptions))

const assetsDir = path.join(__dirname, 'public/assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
    console.log('📁 Created assets directory');
}
app.use('/assets', (req, res, next) => {
    const filePath = path.join(__dirname, 'public/assets', req.path);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
        next();
    } else {
        // If requested file doesn't exist, check if it's an image request
        if (req.path.match(/\.(jpg|jpeg|png|gif)$/i)) {
            console.log(`⚠️  Asset not found: ${req.path}, serving default avatar`);
            
            // Try to serve default avatar
            const defaultImagePath = path.join(__dirname, 'public/assets/default-avatar.png');
            if (fs.existsSync(defaultImagePath)) {
                res.sendFile(defaultImagePath);
            } else {
                // Create a simple SVG placeholder if default-avatar.png doesn't exist
                const svgPlaceholder = `
                    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="50" fill="#e0e0e0"/>
                        <circle cx="50" cy="40" r="15" fill="#bdbdbd"/>
                        <ellipse cx="50" cy="75" rx="25" ry="20" fill="#bdbdbd"/>
                    </svg>
                `;
                res.setHeader('Content-Type', 'image/svg+xml');
                res.send(svgPlaceholder);
            }
        } else {
            res.status(404).json({ error: 'Asset not found' });
        }
    }
}, express.static(path.join(__dirname, 'public/assets')));
app.use('/assets', express.static(path.join(__dirname,'public/assets')))

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadPath = path.join(__dirname, "public/assets");
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        // Generate unique filename to avoid conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = file.originalname.replace(ext, '');
        cb(null, name + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // Default to 10MB
    }
});


// ROUTER WITH FILES 

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES
app.use('/auth',authRouters)
app.use('/users',userRouters)
app.use("/posts",postRouters)
app.use("/posts",commentRouters)
app.use("/advertisements", advertisementRouters) 

app.use((error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            error: 'File too large',
            message: `Maximum file size is ${(parseInt(process.env.MAX_FILE_SIZE) || 10485760) / (1024 * 1024)}MB`
        });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
            error: 'Too many files',
            message: 'Only one file allowed'
        });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            error: 'Unexpected field',
            message: 'Only picture field is allowed'
        });
    }
    
    // Handle other multer errors
    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            error: 'File upload error',
            message: error.message
        });
    }
    
    // Pass other errors to the default error handler
    next(error);
});

// mongoose settings 
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URL)
.then(async () => {
    console.log('🚀 Connected to MongoDB successfully');
    
    // Seed database if empty
    await seedDatabase();
    
    app.listen(PORT, () => {
        console.log(`🎯 Server listening on port: ${PORT}`);
        console.log(`🌐 Server URL: http://localhost:${PORT}`);
        console.log(`📊 MongoDB Admin: http://localhost:8082`); // Fixed port
    });
}).catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
});