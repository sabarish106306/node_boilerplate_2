import { Pool } from "pg";
import { metaData } from "../../environment/meta-data";

export class Connectionservice {
  static postgresConnection(database: string) {
    return new Pool({
      user: metaData.db.user,
      password: metaData.db.password,
      database: database,
      host: metaData.db.host,
      port: metaData.db.port,
      statement_timeout: metaData.db.connectionTimeOut,
      idleTimeoutMillis: metaData.db.connectionTimeOut,
      connectionTimeoutMillis: metaData.db.connectionTimeOut,
    });
  }
}
