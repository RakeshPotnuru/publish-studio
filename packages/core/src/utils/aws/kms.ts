import type { DecryptCommandInput } from "@aws-sdk/client-kms";
import { DecryptCommand, EncryptCommand, KMSClient } from "@aws-sdk/client-kms";
import { TRPCError } from "@trpc/server";

import defaultConfig from "../../config/app.config";
import type { IKMS } from "../../types/aws.types";

const kms = new KMSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
} as IKMS);

/**
 * The `encryptField` function encrypts a given string value using AWS Key Management Service (KMS) and
 * returns the encrypted value as a base64-encoded string.
 * @param {string} value - The `value` parameter is the string that you want to encrypt. It is the data
 * that you want to protect and keep secure.
 * @returns a Promise that resolves to a string.
 */
export const encryptField = async (value: string) => {
    const params = {
        KeyId: process.env.AWS_KMS_KEY_ID,
        Plaintext: Buffer.from(value),
    };

    const command = new EncryptCommand(params);
    const response = await kms.send(command);

    if (!response.CiphertextBlob) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: defaultConfig.defaultErrorMessage,
        });
    }

    return Buffer.from(response.CiphertextBlob).toString("base64");
};

/**
 * The `decryptField` function decrypts a given value using the AWS Key Management Service (KMS) and
 * returns the decrypted plaintext.
 * @param {string} value - The `value` parameter is a string that represents the encrypted data that
 * needs to be decrypted.
 * @returns the decrypted value as a string.
 */
export const decryptField = async (value: string) => {
    const base64Value = atob(value);

    if (!base64Value) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: defaultConfig.defaultErrorMessage,
        });
    }

    const params: DecryptCommandInput = {
        // eslint-disable-next-line unicorn/prefer-code-point
        CiphertextBlob: Uint8Array.from(base64Value, v => v.charCodeAt(0)),
    };

    const command = new DecryptCommand(params);
    const response = await kms.send(command);

    if (!response.Plaintext) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: defaultConfig.defaultErrorMessage,
        });
    }

    return Buffer.from(response.Plaintext).toString();
};
