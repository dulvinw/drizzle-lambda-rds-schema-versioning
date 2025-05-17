# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Getting Started

Before deploying this CDK stack, you need to bootstrap your AWS environment. Bootstrapping is a one-time setup process that creates resources required by CDK in your AWS account.

You can bootstrap your environment in two ways:

1. Run the provided script: `./bootstrap.sh`
2. Run the npm command: `npm run bootstrap`

## Useful commands

* `npm run build`     compile typescript to js
* `npm run watch`     watch for changes and compile
* `npm run test`      perform the jest unit tests
* `npm run bootstrap` bootstrap CDK in your AWS account/region (required before first deployment)
* `npx cdk deploy`    deploy this stack to your default AWS account/region
* `npx cdk diff`      compare deployed stack with current state
* `npx cdk synth`     emits the synthesized CloudFormation template
