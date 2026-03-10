import Redis from 'ioredis';

const redis = new Redis('redis://127.0.0.1:6380');

redis.on('connect', () => {
  console.log('Connected to 127.0.0.1:6380');
  process.exit(0);
});

redis.on('error', (err) => {
  console.error('Error connecting to 127.0.0.1:6380:', err.message);
  
  const redisLocalhost = new Redis('redis://localhost:6380');
  redisLocalhost.on('connect', () => {
    console.log('Connected to localhost:6380');
    process.exit(0);
  });
  redisLocalhost.on('error', (err2) => {
    console.error('Error connecting to localhost:6380:', err2.message);
    process.exit(1);
  });
});

setTimeout(() => {
  console.error('Timeout');
  process.exit(1);
}, 5000);
