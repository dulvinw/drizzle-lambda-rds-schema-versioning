import {Construct} from "constructs";

import {
    Architecture,
    Code,
    DockerImageCode,
    DockerImageFunction,
    Function as LambdaFunction,
    Runtime
} from "aws-cdk-lib/aws-lambda";
import {IVpc, SecurityGroup, SubnetType} from "aws-cdk-lib/aws-ec2";

interface SchemaMigrationLambdaProps {
    vpc: IVpc;
}

export class SchemaMigrationLambda extends Construct {
    public readonly lambdaFunction: LambdaFunction;
    public readonly lambdaSecurityGroup: SecurityGroup;

    constructor(scope: Construct, id: string, {vpc}: SchemaMigrationLambdaProps) {
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
            vpcSubnets: vpc.selectSubnets({subnetType: SubnetType.PRIVATE_WITH_EGRESS}),
            architecture: Architecture.ARM_64,
        });
    }
}