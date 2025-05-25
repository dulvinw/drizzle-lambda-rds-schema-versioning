import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ServerlessPostgres } from '../constructs/serverless-postgres';
import { SchemaMigrationLambda } from '../constructs/schema-migration-lambda';

export class RdbSchemaVersioningStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    const database = new ServerlessPostgres(this, 'ServerlessPostgres', {
      vpc,
    });
    const { dbSecurityGroup, dbSecret } = database;

    const migrationLambda = new SchemaMigrationLambda(this, 'SchemaMigrationLambda', {
      vpc,
      dbSecret,
    });
    const { lambdaFunction, lambdaSecurityGroup } = migrationLambda;

    dbSecurityGroup.addIngressRule(lambdaSecurityGroup, ec2.Port.tcp(3306));
    dbSecret.grantRead(lambdaFunction);
  }
}
