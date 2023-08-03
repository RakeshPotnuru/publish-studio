interface ICustomConfig {
    port: number;
    baseUrl: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
    origin: string;
    redisUrl: string;
    mongoURI: string;
    accessTokenPrivateKey: string;
    refreshTokenPrivateKey: string;
    accessTokenPublicKey: string;
    refreshTokenPublicKey: string;
    redisCacheExpiresIn: number;
    defaultErrorMessage: string;
    hashnode_api_url: string;
    devto_api_url: string;
    medium_api_url: string;
}

const defaultConfig: ICustomConfig = {
    port: process.env.PORT ? Number.parseInt(process.env.PORT) : 5000,
    baseUrl: process.env.BASE_URL || "http://localhost:5000",
    accessTokenExpiresIn: 1440,
    refreshTokenExpiresIn: 1485,
    origin: process.env.ORIGIN_URL || "http://localhost:3000",
    redisCacheExpiresIn: 1440,
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/psDB",
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
    defaultErrorMessage: "Something went wrong. Please try again later.",
    hashnode_api_url: process.env.HAHSNODE_API_URL,
    devto_api_url: process.env.DEVTO_API_URL,
    medium_api_url: process.env.MEDIUM_API_URL,
};

export default defaultConfig;
