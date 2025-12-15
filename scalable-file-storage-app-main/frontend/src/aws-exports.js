// src/aws-exports.js
import { awsConfig } from "./aws-config";

const awsconfig = {
  Auth: {
    Cognito: {
      region: awsConfig.identityRegion,
      userPoolId: awsConfig.userPoolId,
      userPoolClientId: awsConfig.userPoolClientId,
      loginWith: {
        email: true,
        username: false,
      },
    },
  },
};

export default awsconfig;
