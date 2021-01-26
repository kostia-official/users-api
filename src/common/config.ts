export const config = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url:
      process.env.DATABASE_URL ||
      'postgres://root:supersecret@localhost:5434/memeization-nest',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecret',
    expiresIn: '8h',
  },
});
