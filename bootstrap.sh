#!/bin/bash

echo "Bootstrapping CDK environment..."
echo "This will provision resources in your AWS account that are required for CDK deployments."
echo "Account: 903887808920"
echo "Region: eu-west-1"
echo ""

# Run the bootstrap command
npm run bootstrap -- --profile default

echo ""
echo "Bootstrap complete. You can now deploy your CDK stack using 'npm run cdk deploy'."