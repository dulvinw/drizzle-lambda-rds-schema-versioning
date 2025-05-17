import {Construct} from "constructs";
import * as rds from "aws-cdk-lib/aws-rds";
import {ClusterInstance, DatabaseCluster} from "aws-cdk-lib/aws-rds";
import {Secret} from "aws-cdk-lib/aws-secretsmanager";
import {IVpc, SecurityGroup, SubnetType} from "aws-cdk-lib/aws-ec2";

interface ServerlessPostgresProps {
    vpc: IVpc;
}

export class ServerlessPostgres extends Construct {
    public readonly database: DatabaseCluster;
    public readonly dbSecurityGroup: SecurityGroup;
    public readonly dbSecret: Secret;

    constructor(scope: Construct, id: string, {vpc}: ServerlessPostgresProps) {
        super(scope, id);

        this.dbSecret = new rds.DatabaseSecret(this, 'DatabaseSecret', {
            username: 'clusteradmin',
            dbname: 'cluster_db',
            secretName: 'cluster_db_secret'
        });
        this.dbSecurityGroup = new SecurityGroup(this, 'DBSecGroup', {
            securityGroupName: 'db_sec_group',
            allowAllOutbound: true,
            vpc,
            description: 'Allows access to the database',
        });
        this.database = new rds.DatabaseCluster(this, 'AuroraCluster', {
            serverlessV2MaxCapacity: 1,
            serverlessV2MinCapacity: 0,
            securityGroups: [this.dbSecurityGroup],
            writer: ClusterInstance.serverlessV2('writer'),
            readers: [ClusterInstance.serverlessV2('reader')],
            engine: rds.DatabaseClusterEngine.auroraMysql({
                version: rds.AuroraMysqlEngineVersion.VER_3_08_2,
            }),
            vpc,
            vpcSubnets: {
                subnetType: SubnetType.PRIVATE_WITH_EGRESS
            },
            credentials: rds.Credentials.fromSecret(this.dbSecret),
            defaultDatabaseName: 'cluster_db',
        })
    }
}