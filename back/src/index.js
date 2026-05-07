import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();


const PORT = process.env.PORT || 5001;
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
