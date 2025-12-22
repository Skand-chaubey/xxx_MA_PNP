import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'phone_number', type: 'string', isIndexed: true },
        { name: 'name', type: 'string', isOptional: true },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'kyc_status', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'meters',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'discom_name', type: 'string' },
        { name: 'consumer_number', type: 'string', isIndexed: true },
        { name: 'meter_serial_id', type: 'string' },
        { name: 'verification_status', type: 'string' },
        { name: 'address', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'energy_data',
      columns: [
        { name: 'meter_id', type: 'string', isIndexed: true },
        { name: 'timestamp', type: 'number', isIndexed: true },
        { name: 'generation', type: 'number' },
        { name: 'consumption', type: 'number' },
        { name: 'net_export', type: 'number' },
        { name: 'interval', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'transactions',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'type', type: 'string' },
        { name: 'amount', type: 'number' },
        { name: 'currency', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'orders',
      columns: [
        { name: 'buyer_id', type: 'string', isIndexed: true },
        { name: 'seller_id', type: 'string', isIndexed: true },
        { name: 'energy_amount', type: 'number' },
        { name: 'price_per_unit', type: 'number' },
        { name: 'total_price', type: 'number' },
        { name: 'status', type: 'string' },
        { name: 'created_at', type: 'number', isIndexed: true },
        { name: 'completed_at', type: 'number', isOptional: true },
      ],
    }),
  ],
});

