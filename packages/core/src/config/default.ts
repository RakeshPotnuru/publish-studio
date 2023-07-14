const customConfig: {
    port: number;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
    origin: string;
    dbUri: string;
    accessTokenPrivateKey: string;
    refreshTokenPrivateKey: string;
    accessTokenPublicKey: string;
    refreshTokenPublicKey: string;
    redisCacheExpiresIn: number;
} = {
    port: process.env.PORT ? Number.parseInt(process.env.PORT) : 5000,
    accessTokenExpiresIn: 15,
    refreshTokenExpiresIn: 60,
    origin: "http://localhost:5000",
    redisCacheExpiresIn: 60,

    dbUri: process.env.MONGO_URI,
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
};

export default customConfig;
