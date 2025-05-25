import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { SecretsManager } from 'aws-sdk';
import * as mysql from 'mysql2/promise';

const getDbPool = async () => {
  const secret = await new SecretsManager()
    .getSecretValue({ SecretId: process.env.DB_SECRET_ARN! })
    .promise();

  if (!secret.SecretString) {
    throw new Error('DB secret not found');
  }

  const { host, username, password, port, dbname } = JSON.parse(secret.SecretString);
  return mysql.createPool({
    host,
    user: username,
    password,
    database: dbname,
    port,
  });
};

const migrationConfig = {
  migrationsFolder: './drizzle',
  migrationsTable: 'drizzle_migrations',
};

export const handler = async (event: CloudFormationCustomResourceEvent) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  let responseData = {};

  try {
    switch (event.RequestType) {
      case 'Create':
        responseData = handleCreate();
        break;

      case 'Update':
        console.log('Update');
        break;

      case 'Delete':
        console.log('Delete');
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    responseData = { statusCode: 500, body: JSON.stringify({ eventMessage: error }) };
  }

  return responseData;
};

const handleCreate = async () => {
  const db = drizzle({ client: await getDbPool() });
  try {
    await migrate(db, migrationConfig);
    return { statusCode: 200, body: JSON.stringify({ eventMessage: 'Resource created' }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ eventMessage: e }) };
  }
};
