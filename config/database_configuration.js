import "dotenv/config";
import Pool from 'pg'
const PoolConstructor = Pool.Pool;
const pool = new PoolConstructor({
  user: "postgres",
  host: "localhost",
  database: "PersonalProjectDB",
  password: process.env.POSTGRES_PASS,
  port: process.env.PORT_DB,
});

export default pool
