import { Kysely, TableMetadata } from 'kysely';
import { Dialect } from './dialect';

export type CreateKyselyOptions = IntrospectOptions & {
  ssl: boolean;
};

export type IntrospectOptions = {
  connectionString: string;
  dialect: Dialect;
};

/**
 * Uses the Kysely introspector to gather table metadata from a database connection.
 */
export class Introspector {
  async createKysely(options: CreateKyselyOptions) {
    return new Kysely<any>({
      dialect: await options.dialect.createKyselyDialect({
        connectionString: options.connectionString,
        ssl: options.ssl,
      }),
    });
  }

  async introspect(options: IntrospectOptions) {
    let tables: TableMetadata[] = [];

    // Insane solution in lieu of a better one.
    // We'll create a database connection with SSL, and if it complains about SSL, try without it.
    for (const ssl of [true, false]) {
      try {
        const db = await this.createKysely({ ...options, ssl });

        tables = await db.introspection.getTables();

        await db.destroy();
        break;
      } catch (error) {
        const isSslError =
          error instanceof Error && /\bSSL\b/.test(error.message);
        const isUnexpectedError = !ssl || !isSslError;

        if (isUnexpectedError) {
          throw error;
        }
      }
    }

    return tables;
  }
}
