// src/aws-config.js
export const awsConfig = {
  identityRegion: "us-east-1",
  s3Region: "us-east-1",

  userPoolId: "us-east-1_0Q99e553N",
  userPoolClientId: "120vfbb5r97d01vio63cisbqti",
  identityPoolId: "us-east-1:935b918b-e5da-467c-84e3-1f0eaa4d7690",

  s3Bucket: "harishraj-madhavan-project-s3",

  // ✅ Hosted UI domain (must match Cognito > Domain page EXACTLY)
  cognitoDomain: "https://us-east-1o099e553n.auth.us-east-1.amazoncognito.com",
};
