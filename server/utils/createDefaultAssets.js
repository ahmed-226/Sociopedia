import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createDefaultAssets = () => {
    const assetsDir = path.join(__dirname, '../public/assets');
    const defaultAvatarPath = path.join(assetsDir, 'default-avatar.png');

    // Ensure assets directory exists
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Create a simple SVG default avatar if PNG doesn't exist
    if (!fs.existsSync(defaultAvatarPath)) {
        // Create an SVG content for default avatar
        const svgContent = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="100" fill="#e0e0e0"/>
            <circle cx="100" cy="80" r="30" fill="#bdbdbd"/>
            <ellipse cx="100" cy="160" rx="50" ry="40" fill="#bdbdbd"/>
            <text x="100" y="50" text-anchor="middle" font-family="Arial" font-size="14" fill="#666">Default</text>
        </svg>`;
        
        // Write a placeholder file for now
        const placeholderPath = path.join(assetsDir, 'default-avatar.txt');
        fs.writeFileSync(placeholderPath, 'Please add default-avatar.png to this directory');
        
        console.log('⚠️  default-avatar.png not found, created placeholder');
        console.log('   Please add a proper default-avatar.png file to:', assetsDir);
        
        // For immediate fix, create a simple base64 encoded 1x1 pixel PNG
        const base64PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        const buffer = Buffer.from(base64PNG, 'base64');
        fs.writeFileSync(defaultAvatarPath, buffer);
        
        console.log('✅ Created temporary default-avatar.png');
    }
};