// MongoDB initialization script
db = db.getSiblingDB('sociopedia');

// Create collections
db.createCollection('users');
db.createCollection('posts');

print('Database and collections created successfully!');