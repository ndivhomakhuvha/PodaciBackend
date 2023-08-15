import "dotenv/config";
import Pool from 'pg'




const PoolConstructor = Pool.Pool;
const pool = new PoolConstructor({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASS,
  port: process.env.PORT_DB,
  ssl: true,
  synchronize: true,
  extra: {
    trustServerCertificate: true,
  }

});

export default pool
