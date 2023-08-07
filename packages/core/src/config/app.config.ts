interface ICustomConfig {
    port: number;
    baseUrl: string;
    whitelist_origins?: string[];
    redisUrl: string;
    mongoURI: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
    accessTokenPrivateKey: string;
    refreshTokenPrivateKey: string;
    accessTokenPublicKey: string;
    refreshTokenPublicKey: string;
    redisCacheExpiresIn: number;
    defaultErrorMessage: string;
    hashnode_api_url: string;
    devto_api_url: string;
    medium_api_url: string;
    kickbox_api_url: string;
}

const defaultConfig: ICustomConfig = {
    port: process.env.PORT ? Number.parseInt(process.env.PORT) : 5000,
    baseUrl: process.env.BASE_URL || "http://localhost:5000",
    accessTokenExpiresIn: 1440,
    refreshTokenExpiresIn: 1485,
    whitelist_origins: process.env.WHITELIST_ORIGINS?.split(","),
    redisCacheExpiresIn: 1440,
    redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/psDB",
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
    defaultErrorMessage: "Something went wrong. Please try again later.",
    hashnode_api_url: "https://api.hashnode.com",
    devto_api_url: "https://dev.to/api",
    medium_api_url: "https://api.medium.com/v1",
    kickbox_api_url: "https://open.kickbox.com/v1/disposable",
};

export default defaultConfig;
