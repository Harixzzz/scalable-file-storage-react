// src/aws/s3Client.js
import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { awsConfig } from "../aws-config";

/**
 * Creates a real AWS SDK v3 S3Client
 * This MUST return an S3Client instance
 */
export async function createS3Client(idToken) {
  if (!idToken) {
    throw new Error("Missing idToken for S3 client");
  }

  return new S3Client({
    region: awsConfig.region,
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsConfig.region },
      identityPoolId: awsConfig.identityPoolId,
      logins: {
        [`cognito-idp.${awsConfig.region}.amazonaws.com/${awsConfig.userPoolId}`]:
          idToken,
      },
    }),
  });
}
