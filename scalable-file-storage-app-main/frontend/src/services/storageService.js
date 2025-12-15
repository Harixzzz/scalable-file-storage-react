// src/services/storageService.js
import { uploadData, list, remove } from "aws-amplify/storage";

// Decode JWT to extract "sub"
function getSubFromIdToken(idToken) {
  const payloadPart = idToken.split(".")[1];
  const fixed = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(fixed);
  const payload = JSON.parse(json);
  return payload.sub;
}

const bucketOptions = {
  bucket: {
    bucketName: "scalable-web-app-file-storage",
    region: "us-east-2",
  },
};

export function getUserSub(idToken) {
  return getSubFromIdToken(idToken);
}

export async function uploadUserFile(idToken, file) {
  const sub = getSubFromIdToken(idToken);
  const path = `users/${sub}/${file.name}`;

  await uploadData({
    path,
    data: file,
    options: bucketOptions,
  });

  return path;
}

export async function listUserFiles(idToken) {
  const sub = getSubFromIdToken(idToken);
  const prefix = `users/${sub}/`;

  const { items } = await list({
    path: prefix,
    options: bucketOptions,
  });

  return (items || []).map((item) => ({
    key: item.path,
    name: item.path.replace(prefix, ""),
    lastModified: item.lastModified,
    size: item.size,
  }));
}

export async function deleteUserFile(idToken, key) {
  await remove({
    path: key,
    options: bucketOptions,
  });
}
