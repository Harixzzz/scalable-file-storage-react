// src/aws/s3Client.js
import AWS from "aws-sdk";
import { awsConfig } from "../aws-config";

export function createS3Client(idToken) {
  if (!idToken) {
    throw new Error("Missing ID token for Cognito Identity Pool.");
  }

  const loginsKey = `cognito-idp.${awsConfig.identityRegion}.amazonaws.com/${awsConfig.userPoolId}`;

  // Configure Cognito Identity (us-east-2)
  AWS.config.update({
    region: awsConfig.identityRegion,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: awsConfig.identityPoolId,
      Logins: {
        [loginsKey]: idToken,
      },
    }),
  });

  // S3 client for the bucket's region (us-east-1 / s3.amazonaws.com)
  return new AWS.S3({
    apiVersion: "2006-03-01",
    region: awsConfig.s3Region,             // <= us-east-1
    signatureVersion: "v4",
    params: { Bucket: awsConfig.s3Bucket },
  });
}
