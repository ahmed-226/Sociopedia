import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        console.log('File:', req.file);
        
        const {
            firstName,
            lastName,
            email,
            password,
            location,
            occupation,
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ 
                error: "Missing required fields",
                received: { firstName, lastName, email, password: password ? '[HIDDEN]' : undefined }
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email" });
        }

        // Get the filename from multer
        const picturePath = req.file ? req.file.filename : "default-avatar.png";

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        
        const savedUser = await newUser.save();
        
        // Remove password from response
        const userResponse = savedUser.toObject();
        delete userResponse.password;
        
        console.log('User registered successfully:', userResponse);
        res.status(201).json(userResponse);
    } catch (err) {
        console.error('Registration error:', err);
        
        // Handle specific multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                error: "File too large",
                message: `File size must be less than ${(parseInt(process.env.MAX_FILE_SIZE) || 10485760) / (1024 * 1024)}MB`
            });
        }
        
        res.status(500).json({ 
            error: err.message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "fail", message: "user does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "fail", message: "invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ status: "error", error: { message: err.message } });
  }
};

// export default register
