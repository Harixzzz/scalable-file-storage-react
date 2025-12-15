// src/services/s3FileService.js
import { createS3Client } from "../aws/s3Client";
import { awsConfig } from "../aws-config";

// Decode JWT "sub" from ID token
function getSubFromIdToken(idToken) {
  const payloadPart = idToken.split(".")[1];
  const fixed = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(fixed);
  const payload = JSON.parse(json);
  return payload.sub;
}

// Helper: is this file an image?
function isImageFile(name) {
  return /\.(jpe?g|png|webp|gif)$/i.test(name);
}

export async function uploadFile(idToken, file) {
  const s3 = createS3Client(idToken);
  const sub = getSubFromIdToken(idToken);

  const key = `users/${sub}/${file.name}`;

  // Managed upload (handles multipart if needed)
  await s3
    .upload({
      Bucket: awsConfig.s3Bucket,
      Key: key,
      Body: file,
      ContentType: file.type || "application/octet-stream",
    })
    .promise();

  return key;
}

export async function listFiles(idToken) {
  const s3 = createS3Client(idToken);
  const sub = getSubFromIdToken(idToken);
  const prefix = `users/${sub}/`;

  const response = await s3
    .listObjectsV2({
      Bucket: awsConfig.bucketName,
      Prefix: prefix,
    })
    .promise();

  const contents = response.Contents || [];

  // Build list with optional thumbnail URLs for image files
  const files = await Promise.all(
    contents
      .filter((obj) => obj.Key !== prefix) // ignore the "folder" key if present
      .map(async (obj) => {
        const key = obj.Key;
        const name = key.replace(prefix, "");

        let thumbnailUrl = null;
        if (isImageFile(name)) {
          // Short-lived signed URL for preview (5 minutes)
          thumbnailUrl = s3.getSignedUrl("getObject", {
            Bucket: awsConfig.bucketName,
            Key: key,
            Expires: 60 * 5,
          });
        }

        return {
          key,
          name,
          lastModified: obj.LastModified,
          size: obj.Size,
          thumbnailUrl,
        };
      })
  );

  return files;
}

export async function deleteFile(idToken, key) {
  const s3 = createS3Client(idToken);

  await s3
    .deleteObject({
      Bucket: awsConfig.bucketName,
      Key: key,
    })
    .promise();
}
