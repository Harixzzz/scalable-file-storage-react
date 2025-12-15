// src/amplifyConfig.js
import { Amplify } from "aws-amplify";

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: "us-east-1_0Q99e553N",
        userPoolClientId: "120vfbb5r97d01vio63cisbqti",
        identityPoolId: "us-east-1:935b918b-e5da-467c-84e3-1f0eaa4d7690",
        loginWith: { email: true },
        allowGuestAccess: false,
      },
    },
  });
}
