import dotenv from 'dotenv';
dotenv.config();

console.log('Dotenv configured');

import app from './app.js';

const PORT = process.env.PORT || 5001;
console.log(`Attempting to start server on port ${PORT}...`);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.on('close', () => {
  console.log('Server closed');
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});
