import User from "../models/User.js";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ status: "ERROR", message: "User not found" });
        }
        res.status(200).json(user);
    } catch (e) {
        res.status(404).json({ status: "ERROR", message: e.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        console.log('Updating user:', id); // Debug log
        console.log('Updates:', updates); // Debug log
        
        // Remove sensitive fields that shouldn't be updated
        delete updates.password;
        delete updates.email;
        delete updates._id;
        
        // Validate social profiles URLs if provided
        if (updates.socialProfiles) {
            console.log('Validating social profiles:', updates.socialProfiles); // Debug log
            
            for (const [platform, url] of Object.entries(updates.socialProfiles)) {
                if (url && url.trim() !== "") {
                    // Basic URL validation
                    try {
                        new URL(url);
                    } catch (urlError) {
                        console.error('Invalid URL:', url, urlError.message); // Debug log
                        return res.status(400).json({ 
                            status: "ERROR", 
                            message: `Invalid URL format for ${platform}: ${url}` 
                        });
                    }
                }
            }
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            console.error('User not found:', id); // Debug log
            return res.status(404).json({ status: "ERROR", message: "User not found" });
        }
        
        console.log('User updated successfully:', updatedUser._id); // Debug log
        res.status(200).json(updatedUser);
    } catch (e) {
        console.error('Update user error:', e); // Debug log
        res.status(400).json({ status: "ERROR", message: e.message });
    }
};

export const getUserFriend = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ status: "ERROR", message: "User not found" });
        }

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        
        const formattedFriends = friends
            .filter(friend => friend !== null)
            .map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            });
            
        res.status(200).json(formattedFriends);
    } catch (e) {
        res.status(404).json({ status: "ERROR", message: e.message });
    }
};

export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        
        if (!user || !friend) {
            return res.status(404).json({ message: "User or friend not found" });
        }
    
        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((fId) => fId !== friendId);
            friend.friends = friend.friends.filter((fId) => fId !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        
        await user.save();
        await friend.save();
    
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        
        const formattedFriends = friends
            .filter(friend => friend !== null)
            .map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            });
    
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};