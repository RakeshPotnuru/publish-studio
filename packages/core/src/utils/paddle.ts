import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.PADDLE_API_KEY, {
  environment:
    process.env.SITE_ENV === "production"
      ? Environment.production
      : Environment.sandbox,
  logLevel: LogLevel.error,
});

export default paddle;
