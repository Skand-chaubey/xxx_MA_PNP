import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';

// Create SQLite adapter
const adapter = new SQLiteAdapter({
  schema,
  // migrations: migrations, // Add migrations when needed
  dbName: 'powernetpro',
  jsi: false, // Set to false for Expo compatibility
});

// Create database instance
export const database = new Database({
  adapter,
  modelClasses: [
    // Add model classes here when created
    // UserModel,
    // MeterModel,
    // EnergyDataModel,
    // TransactionModel,
    // OrderModel,
  ],
});

