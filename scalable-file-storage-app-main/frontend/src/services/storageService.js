import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import awsConfig from "../aws-config";

function getS3Client(idToken) {
  return new S3Client({
    region: awsConfig.region,
    credentials: fromCognitoIdentityPool({
      identityPoolId: awsConfig.identityPoolId,
      logins: {
        [`cognito-idp.${awsConfig.region}.amazonaws.com/${awsConfig.userPoolId}`]:
          idToken,
      },
    }),
  });
}

export async function uploadFileToS3(file, idToken) {
  const s3 = getS3Client(idToken);

  const command = new PutObjectCommand({
    Bucket: awsConfig.s3Bucket,
    Key: `uploads/${Date.now()}-${file.name}`,
    Body: file,
    ContentType: file.type,
  });

  await s3.send(command);
}

export async function listFiles(idToken) {
  const s3 = getS3Client(idToken);

  const command = new ListObjectsV2Command({
    Bucket: awsConfig.s3Bucket,
    Prefix: "uploads/",
  });

  const data = await s3.send(command);
  return data.Contents || [];
}
