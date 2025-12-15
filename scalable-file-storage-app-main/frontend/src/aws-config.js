// src/aws-config.js
export const awsConfig = {
  region: "us-east-1",
  userPoolId: "us-east-1_0Q99e553N",
  userPoolClientId: "120vfbb5r97d01vio63cisbqti",

  // ✅ MUST HAVE THE DASH: us-east-1-0o99e553n
  cognitoDomain: "https://us-east-1-0o99e553n.auth.us-east-1.amazoncognito.com",

  // ✅ MUST EXIST OR ELSE redirect_uri becomes undefined
  redirectUri: "http://localhost:3000/",
};
