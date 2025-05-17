#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { RdbSchemaVersioningStack } from '../lib/rdb-schema-versioning-stack';

const app = new cdk.App();
new RdbSchemaVersioningStack(app, 'RdbSchemaVersioningStack', {
   env: { account: '903887808920', region: 'eu-west-1' },
});