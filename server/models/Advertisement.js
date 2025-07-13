import mongoose from "mongoose";

const AdvertisementSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true,
            max: 100
        },
        website: {
            type: String,
            required: true,
            trim: true,
            max: 200
        },
        description: {
            type: String,
            required: true,
            max: 500
        },
        image: {
            type: String,
            required: true
        },
        backgroundColor: {
            type: String,
            default: "#FFFFFF"
        },
        textColor: {
            type: String,
            default: "#000000"
        },
        isActive: {
            type: Boolean,
            default: true
        },
        clickCount: {
            type: Number,
            default: 0
        },
        impressions: {
            type: Number,
            default: 0
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
            default: null
        },
        targetAudience: {
            type: [String],
            default: []
        },
        budget: {
            type: Number,
            default: 0
        },
        costPerClick: {
            type: Number,
            default: 0
        },
        priority: {
            type: Number,
            default: 1,
            min: 1,
            max: 10
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient querying
AdvertisementSchema.index({ isActive: 1, priority: -1 });
AdvertisementSchema.index({ startDate: 1, endDate: 1 });

const Advertisement = mongoose.model('Advertisement', AdvertisementSchema);
export default Advertisement;