import "dotenv/config";
import Pool from "pg";
import fs from 'fs/promises';

const sslCertPath = "ssl/prod-ca-2021.crt";


const PoolConstructor = Pool.Pool;
const pool = new PoolConstructor({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASS,
  port: process.env.PORT_DB,
  ssl: {
    ca: await fs.readFile(sslCertPath, 'utf-8'),
  },
  synchronize: true,
  extra: {
    trustServerCertificate: true,
  },
});

export default pool;
