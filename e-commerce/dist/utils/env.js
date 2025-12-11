import dotenv from 'dotenv';
dotenv.config();
export default {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    NODE: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL
};
//# sourceMappingURL=env.js.map