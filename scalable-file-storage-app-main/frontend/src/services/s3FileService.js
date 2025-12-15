// src/services/s3FileService.js

import {
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { awsConfig } from "../aws-config";
import { createS3Client as getS3Client } from "../aws/s3Client";

// Put files under a per-user prefix so each user has own folder
function getUserPrefixFromIdToken(idToken) {
  try {
    const payload = JSON.parse(
      atob(idToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    return (payload.email || payload.sub || "user").replace(
      /[^a-zA-Z0-9@._-]/g,
      "_"
    );
  } catch {
    return "user";
  }
}

// ---------------- UPLOAD ----------------
export async function uploadFileToS3(idToken, file) {
  const s3 = await getS3Client(idToken);
  const prefix = getUserPrefixFromIdToken(idToken);
  const key = `${prefix}/${Date.now()}-${file.name}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: key,
      Body: file,
      ContentType: file.type || "application/octet-stream",
    })
  );

  return key;
}

// ---------------- LIST ----------------
export async function listUserFiles(idToken) {
  const s3 = await getS3Client(idToken);
  const prefix = `${getUserPrefixFromIdToken(idToken)}/`;

  const res = await s3.send(
    new ListObjectsV2Command({
      Bucket: awsConfig.bucketName,
      Prefix: prefix,
    })
  );

  return (res.Contents || []).map((obj) => ({
    key: obj.Key,
    size: obj.Size,
    lastModified: obj.LastModified,
  }));
}

// ---------------- DELETE ----------------
export async function deleteFile(idToken, key) {
  const s3 = await getS3Client(idToken);

  await s3.send(
    new DeleteObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: key,
    })
  );
}

// ---------------- DOWNLOAD ----------------
export async function getDownloadUrl(idToken, key) {
  const s3 = await getS3Client(idToken);

  const command = new GetObjectCommand({
    Bucket: awsConfig.bucketName,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn: 300 });
}
