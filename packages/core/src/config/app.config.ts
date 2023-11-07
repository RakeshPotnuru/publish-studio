interface ICustomConfig {
    port: number;
    baseUrl: string;
    whitelist_origins?: string[];
    redis_url: string;
    mongoURI: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
    verificationTokenExpiresIn: number;
    resetPasswordTokenExpiresIn: number;
    accessTokenPrivateKey: string;
    refreshTokenPrivateKey: string;
    accessTokenPublicKey: string;
    refreshTokenPublicKey: string;
    verificationTokenPrivateKey: string;
    verificationTokenPublicKey: string;
    redisCacheExpiresIn: number;
    defaultErrorMessage: string;
    hashnode_api_url: string;
    devto_api_url: string;
    medium_api_url: string;
    kickbox_api_url: string;
    client_url: string;
    app_name: string;
    resetPasswordTokenPrivateKey: string;
    resetPasswordTokenPublicKey: string;
    // rabbitmqUrl: string;
    redis_host: string;
    redis_port: number;
}

const defaultConfig: ICustomConfig = {
    port: process.env.PORT ? Number.parseInt(process.env.PORT) : 4000,
    baseUrl: process.env.BASE_URL || "http://localhost:5000",
    accessTokenExpiresIn: 1440, // 24 hours
    refreshTokenExpiresIn: 1485,
    verificationTokenExpiresIn: 60, // 1 hour
    resetPasswordTokenExpiresIn: 60, // 1 hour
    redisCacheExpiresIn: 1440, // 24 hours
    whitelist_origins: process.env.WHITELIST_ORIGINS?.split(","),
    redis_url: process.env.REDIS_URL || "redis://localhost:6379",
    redis_host: process.env.REDIS_HOST || "localhost",
    redis_port: process.env.REDIS_PORT ? Number.parseInt(process.env.REDIS_PORT) : 6379,
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/psDB",
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
    verificationTokenPrivateKey: process.env.VERIFICATION_TOKEN_PRIVATE_KEY,
    verificationTokenPublicKey: process.env.VERIFICATION_TOKEN_PUBLIC_KEY,
    resetPasswordTokenPrivateKey: process.env.RESET_PASSWORD_TOKEN_PRIVATE_KEY,
    resetPasswordTokenPublicKey: process.env.RESET_PASSWORD_TOKEN_PUBLIC_KEY,
    defaultErrorMessage: "Something went wrong. Please try again later.",
    hashnode_api_url: "https://api.hashnode.com",
    devto_api_url: "https://dev.to/api",
    medium_api_url: "https://api.medium.com/v1",
    kickbox_api_url: "https://open.kickbox.com/v1/disposable",
    client_url: process.env.CLIENT_URL || "http://localhost:3000",
    app_name: "Publish Studio",
    // rabbitmqUrl: process.env.RABBITMQ_URL || "amqp://127.0.0.1:5672",
};

export const bullMQConnectionOptions = {
    host: defaultConfig.redis_host,
    port: defaultConfig.redis_port,
};

export default defaultConfig;
