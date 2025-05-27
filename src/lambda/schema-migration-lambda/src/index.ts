import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import * as mysql from 'mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { drizzle } from 'drizzle-orm/mysql2';

const secretManager = new SecretsManagerClient();

const getDbPool = async () => {
  const response = await secretManager.send(
    new GetSecretValueCommand({ SecretId: process.env.DB_SECRET_ARN! }),
  );

  if (!response.SecretString) {
    throw new Error('DB secret not found');
  }

  const { host, username, password, port, dbname } = JSON.parse(response.SecretString);
  return mysql.createConnection({
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
        responseData = handleCreate();
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
  const dbPool = await getDbPool();
  const db = drizzle({ client: dbPool });
  try {
    await migrate(db, migrationConfig);
    return { statusCode: 200, body: JSON.stringify({ eventMessage: 'Resource created' }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ eventMessage: e }) };
  }
};
