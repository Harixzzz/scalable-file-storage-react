// src/aws/s3Client.js (The correct v3 code)
import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { awsConfig } from "../aws-config"; 

export async function createS3Client(idToken) {
  const logins = {
    [awsConfig.cognitoLoginProvider]: idToken,
  };

  const cognitoProvider = fromCognitoIdentityPool({
    identityPoolId: awsConfig.identityPoolId, 
    region: awsConfig.region, 
    logins: logins,
  });

  return new S3Client({
    region: awsConfig.region,
    credentials: cognitoProvider,
  });
}