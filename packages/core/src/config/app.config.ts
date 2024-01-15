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
    wordpress_api_url: string;
    wordpress_redirect_uri: string;
    blogger_redirect_uri: string;
    kickbox_api_url: string;
    client_url: string;
    app_name: string;
    resetPasswordTokenPrivateKey: string;
    resetPasswordTokenPublicKey: string;
    redis_host: string;
    redis_port: number;
}

const defaultConfig: ICustomConfig = {
    port: process.env.PORT ? Number.parseInt(process.env.PORT) : 4000,
    baseUrl: process.env.BASE_URL,
    accessTokenExpiresIn: 1440, // 24 hours
    refreshTokenExpiresIn: 1485,
    verificationTokenExpiresIn: 60, // 1 hour
    resetPasswordTokenExpiresIn: 60, // 1 hour
    redisCacheExpiresIn: 1440, // 24 hours
    whitelist_origins: process.env.WHITELIST_ORIGINS?.split(","),
    redis_url: process.env.REDIS_URL,
    redis_host: process.env.REDIS_HOST,
    redis_port: Number.parseInt(process.env.REDIS_PORT),
    mongoURI: process.env.MONGO_URI,
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
    verificationTokenPrivateKey: process.env.VERIFICATION_TOKEN_PRIVATE_KEY,
    verificationTokenPublicKey: process.env.VERIFICATION_TOKEN_PUBLIC_KEY,
    resetPasswordTokenPrivateKey: process.env.RESET_PASSWORD_TOKEN_PRIVATE_KEY,
    resetPasswordTokenPublicKey: process.env.RESET_PASSWORD_TOKEN_PUBLIC_KEY,
    defaultErrorMessage: "Something went wrong. Please try again later.",
    hashnode_api_url: "https://gql.hashnode.com",
    devto_api_url: "https://dev.to/api",
    medium_api_url: "https://api.medium.com/v1",
    wordpress_api_url: "https://public-api.wordpress.com",
    wordpress_redirect_uri: `${process.env.CLIENT_URL}/settings/integrations/connect-wp`,
    blogger_redirect_uri: `${process.env.CLIENT_URL}/settings/integrations/connect-blogger`,
    kickbox_api_url: "https://open.kickbox.com/v1/disposable",
    client_url: process.env.CLIENT_URL,
    app_name: "Publish Studio",
};

export const bullMQConnectionOptions = {
    host: defaultConfig.redis_host,
    port: defaultConfig.redis_port,
};

export default defaultConfig;
