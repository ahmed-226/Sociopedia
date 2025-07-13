const allowedOrigins = [
    'https://sociopedia-client-ztmd.onrender.com',
    'http://localhost:3000',
    'http://localhost:3001', // Add server URL
    'http://127.0.0.1:3000', // Add alternative localhost
    undefined // Allow requests with no origin (like mobile apps)
]

export default allowedOrigins