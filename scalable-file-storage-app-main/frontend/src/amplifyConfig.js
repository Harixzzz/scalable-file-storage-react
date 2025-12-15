// src/amplifyConfig.js
import { Amplify } from "aws-amplify";
import { awsConfig } from "./aws-config";

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        region: awsConfig.region,
        userPoolId: awsConfig.userPoolId,
        userPoolClientId: awsConfig.userPoolWebClientId,
        loginWith: {
          oauth: {
            domain: awsConfig.oauth.domain,
            scopes: awsConfig.oauth.scope,
            redirectSignIn: awsConfig.oauth.redirectSignIn,
            redirectSignOut: awsConfig.oauth.redirectSignOut,
            responseType: awsConfig.oauth.responseType,
          },
        },
      },
    },
  });
}
