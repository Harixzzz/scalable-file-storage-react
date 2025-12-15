// src/aws-exports.js
const awsconfig = {
  Auth: {
    Cognito: {
      region: "us-east-1",
      userPoolId: "us-east-1_0Q99e553N",
      userPoolClientId: "120vfbb5r97d01vio63cisbqti",
      loginWith: {
        email: true,
        username: false,
      },
    },
  },
};

export default awsconfig;
