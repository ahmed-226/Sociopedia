import express from 'express';
import { 
    getActiveAdvertisements, 
    recordAdClick, 
    createAdvertisement, 
    updateAdvertisement, 
    deleteAdvertisement 
} from "../controllers/advertisements.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getActiveAdvertisements);
router.post("/:adId/click", recordAdClick);

// Protected routes (for admin)
router.post("/", verifyToken, createAdvertisement);
router.patch("/:adId", verifyToken, updateAdvertisement);
router.delete("/:adId", verifyToken, deleteAdvertisement);

export default router;