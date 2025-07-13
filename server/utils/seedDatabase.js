import User from '../models/User.js';
import Post from '../models/Post.js';
import Advertisement from '../models/Advertisement.js';
import { users, posts, advertisements } from '../data/index.js'; // Make sure advertisements is imported
import { cleanMigration } from './cleanMigration.js';
import { createDefaultAssets } from './createDefaultAssets.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedDatabase = async () => {
    try {
        // Ensure assets directory exists
        const assetsDir = path.join(__dirname, '../public/assets');
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }

        // Create default assets (including default-avatar.png)
        createDefaultAssets();

        // Check if database is already seeded
        const userCount = await User.countDocuments();
        const adCount = await Advertisement.countDocuments();
        
        console.log(`👥 Current users in database: ${userCount}`);
        console.log(`📢 Current advertisements in database: ${adCount}`);
        
        // Only seed if database is completely empty
        if (userCount === 0) {
            console.log('🌱 Database is empty, seeding with initial data...');
            
            // Seed users
            console.log('👥 Seeding users...');
            await User.insertMany(users);
            console.log('✅ Users seeded successfully');
            
            // Seed posts
            console.log('📝 Seeding posts...');
            await Post.deleteMany({}); // Clear existing posts
            await Post.insertMany(posts);
            console.log('✅ Posts seeded successfully');
            
        } else {
            console.log(`👥 Database already has ${userCount} users, skipping user seeding`);
            
            // Only run post migration/cleanup if needed
            const postCount = await Post.countDocuments();
            console.log(`📝 Found ${postCount} posts in database`);
            
            // Only run clean migration if posts need fixing
            if (postCount > 0) {
                console.log('🔄 Running post data migration...');
                await cleanMigration();
            }
        }

        // Seed advertisements (can be refreshed)
        if (adCount === 0) {
            console.log('📢 Seeding advertisements...');
            console.log(`📊 Importing ${advertisements.length} advertisements from data file`);
            
            try {
                const result = await Advertisement.insertMany(advertisements);
                console.log(`✅ Successfully seeded ${result.length} advertisements`);
                
                // Verify the seeding
                const verifyCount = await Advertisement.countDocuments();
                console.log(`🔍 Verification: ${verifyCount} advertisements now in database`);
                
            } catch (seedError) {
                console.error('❌ Error seeding advertisements:', seedError);
            }
        } else {
            console.log(`📢 Database already has ${adCount} advertisements, skipping ad seeding`);
        }
        
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
    }
};