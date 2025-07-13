import Advertisement from "../models/Advertisement.js";

export const getActiveAdvertisements = async (req, res) => {
    try {
        const currentDate = new Date();
        
        // Debug: Check total count of ads in database
        const totalAds = await Advertisement.countDocuments();
        console.log(`📊 Total advertisements in database: ${totalAds}`);
        
        // Debug: Check active ads count
        const activeAdsCount = await Advertisement.countDocuments({ isActive: true });
        console.log(`✅ Active advertisements: ${activeAdsCount}`);
        
        // Debug: Check date filtering
        const dateFilteredAds = await Advertisement.find({
            isActive: true,
            $or: [
                { endDate: null },
                { endDate: { $gte: currentDate } }
            ],
            startDate: { $lte: currentDate }
        });
        console.log(`📅 Date-filtered advertisements: ${dateFilteredAds.length}`);
        
        // Debug: Log each ad's date info
        dateFilteredAds.forEach(ad => {
            console.log(`Ad: ${ad.company}, Start: ${ad.startDate}, End: ${ad.endDate}, Active: ${ad.isActive}`);
        });
        
        const advertisements = await Advertisement.find({
            isActive: true,
            $or: [
                { endDate: null },
                { endDate: { $gte: currentDate } }
            ],
            startDate: { $lte: currentDate }
        })
        .sort({ priority: -1, impressions: 1 }) // Higher priority first, then less seen ads
        .limit(20); // Limit to 20 active ads
        
        console.log(`🎯 Final advertisements returned: ${advertisements.length}`);
        
        // Increment impressions for returned ads
        const adIds = advertisements.map(ad => ad._id);
        if (adIds.length > 0) {
            await Advertisement.updateMany(
                { _id: { $in: adIds } },
                { $inc: { impressions: 1 } }
            );
        }
        
        res.status(200).json(advertisements);
    } catch (error) {
        console.error('Error fetching advertisements:', error);
        res.status(500).json({ status: "ERROR", message: error.message });
    }
};

export const recordAdClick = async (req, res) => {
    try {
        const { adId } = req.params;
        
        const advertisement = await Advertisement.findByIdAndUpdate(
            adId,
            { $inc: { clickCount: 1 } },
            { new: true }
        );
        
        if (!advertisement) {
            return res.status(404).json({ status: "ERROR", message: "Advertisement not found" });
        }
        
        res.status(200).json({ 
            status: "SUCCESS", 
            message: "Click recorded",
            clickCount: advertisement.clickCount 
        });
    } catch (error) {
        console.error('Error recording ad click:', error);
        res.status(500).json({ status: "ERROR", message: error.message });
    }
};

export const createAdvertisement = async (req, res) => {
    try {
        const newAd = new Advertisement(req.body);
        await newAd.save();
        
        res.status(201).json(newAd);
    } catch (error) {
        console.error('Error creating advertisement:', error);
        res.status(400).json({ status: "ERROR", message: error.message });
    }
};

export const updateAdvertisement = async (req, res) => {
    try {
        const { adId } = req.params;
        const updates = req.body;
        
        const advertisement = await Advertisement.findByIdAndUpdate(
            adId,
            updates,
            { new: true, runValidators: true }
        );
        
        if (!advertisement) {
            return res.status(404).json({ status: "ERROR", message: "Advertisement not found" });
        }
        
        res.status(200).json(advertisement);
    } catch (error) {
        console.error('Error updating advertisement:', error);
        res.status(400).json({ status: "ERROR", message: error.message });
    }
};

export const deleteAdvertisement = async (req, res) => {
    try {
        const { adId } = req.params;
        
        const advertisement = await Advertisement.findByIdAndUpdate(
            adId,
            { isActive: false },
            { new: true }
        );
        
        if (!advertisement) {
            return res.status(404).json({ status: "ERROR", message: "Advertisement not found" });
        }
        
        res.status(200).json({ status: "SUCCESS", message: "Advertisement deactivated" });
    } catch (error) {
        console.error('Error deleting advertisement:', error);
        res.status(500).json({ status: "ERROR", message: error.message });
    }
};