import User from '../models/User.js';
import Post from '../models/Post.js';

export const cleanMigration = async () => {
  try {
    console.log('🧹 Starting clean migration...');
    
    // DON'T clear users - only fix post structure
    // await User.deleteMany({}); // REMOVE THIS LINE
    
    // Get all posts and fix their structure
    const posts = await Post.find({});
    let fixedCount = 0;
    
    for (const post of posts) {
      let needsUpdate = false;
      
      // Fix likes if it's undefined or not a Map
      if (!post.likes || typeof post.likes !== 'object') {
        post.likes = new Map();
        needsUpdate = true;
      }
      
      if (!post.comments) {
        post.comments = [];
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await post.save();
        fixedCount++;
      }
    }
    
    console.log(`✅ Post migration completed! Fixed ${fixedCount} posts.`);
    console.log('👥 User data preserved');
  } catch (error) {
    console.error('❌ Clean migration failed:', error);
  }
};