import { Construct } from 'constructs';

import {
  Architecture,
  DockerImageCode,
  DockerImageFunction,
  Function as LambdaFunction,
} from 'aws-cdk-lib/aws-lambda';
import { IVpc, SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { CustomResource } from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

interface SchemaMigrationLambdaProps {
  vpc: IVpc;
  dbSecret: Secret;
}

export class SchemaMigrationLambda extends Construct {
  public readonly lambdaFunction: LambdaFunction;
  public readonly lambdaSecurityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, { vpc, dbSecret }: SchemaMigrationLambdaProps) {
    super(scope, id);

    this.lambdaSecurityGroup = new SecurityGroup(this, 'LambdaSecGroup', {
      vpc,
      securityGroupName: 'lambda_sec_group',
      allowAllOutbound: true,
    });

    this.lambdaFunction = new DockerImageFunction(this, 'SchemaMigrationLambda', {
      vpc,
      code: DockerImageCode.fromImageAsset('./src/lambda/schema-migration-lambda'),
      securityGroups: [this.lambdaSecurityGroup],
      vpcSubnets: vpc.selectSubnets({ subnetType: SubnetType.PRIVATE_WITH_EGRESS }),
      architecture: Architecture.ARM_64,
      environment: {
        DB_SECRET_ARN: dbSecret.secretArn,
      },
    });

    const customResourceProvider = new Provider(this, 'SchemaMigrationLambdaProvider', {
      onEventHandler: this.lambdaFunction,
      logRetention: RetentionDays.ONE_DAY,
    });

    new CustomResource(this, 'SchemaMigrationLambdaResource', {
      serviceToken: customResourceProvider.serviceToken,
      properties: {
        id,
      },
      resourceType: 'Custom::SchemaMigrationLambda',
    });
  }
}
