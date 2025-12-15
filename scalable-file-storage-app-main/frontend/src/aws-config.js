// src/aws-config.js
export const awsConfig = {
  region: "us-east-1",

  userPoolId: "us-east-1_0Q99e553N",
  userPoolWebClientId: "120vfbb5r97d01vio63cisbqti",

  oauth: {
    domain: "us-east-1-0o99e553n.auth.us-east-1.amazoncognito.com",
    scope: ["openid", "email", "phone"],
    redirectSignIn: "http://localhost:3000/",
    redirectSignOut: "http://localhost:3000/",
    responseType: "code",
  },
};
