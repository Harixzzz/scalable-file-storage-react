// src/amplifyConfig.js
import { Amplify } from "aws-amplify";
import { awsConfig } from "./aws-config";

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: awsConfig.userPoolId,
        userPoolClientId: awsConfig.userPoolClientId,
        identityPoolId: awsConfig.identityPoolId,
        loginWith: { email: true },
        allowGuestAccess: false,
      },
    },
  });
}
