import configcat from "configcat-node";

export const configCatClient = configcat.getClient(
  process.env.CONFIGCAT_SDK_KEY,
);
