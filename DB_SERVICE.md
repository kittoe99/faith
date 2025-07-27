# Database Service Guide

This document explains how to use the new database service for programmatic interaction with your Supabase database.

## Table of Contents
- [Overview](#overview)
- [Setup](#setup)
- [Client-Side Usage](#client-side-usage)
- [Server-Side Usage](#server-side-usage)
- [API Routes](#api-routes)
- [Real-time Subscriptions](#real-time-subscriptions)

## Overview

The new database service provides a simplified way to interact with your Supabase database programmatically. It includes:

1. **DatabaseService** - Generic service for CRUD operations on any table
2. **TestService** - Specific service for the test table with typed methods
3. **API Routes** - Server-side endpoints for database operations
4. **Real-time Subscriptions** - Live updates when data changes

## Setup

1. Ensure your `.env.local` file contains all required Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. The database service is automatically initialized in `lib/db-service.ts`

## Client-Side Usage

### Using the Generic DatabaseService

```typescript
import { DatabaseService } from '@/lib/db-service';

// Get all records from a table
const { data, error } = await DatabaseService.getData('test');

// Get records with filters
const { data, error } = await DatabaseService.getData('test', { is_active: true });

// Insert a new record
const { data, error } = await DatabaseService.insertData('test', {
  name: 'New Test',
  description: 'A test record',
  value: 100
});

// Update a record
const { data, error } = await DatabaseService.updateData('test', 
  { id: 'some-uuid' }, 
  { name: 'Updated Name' }
);

// Delete a record
const { data, error } = await DatabaseService.deleteData('test', { id: 'some-uuid' });
```

### Using the Specific TestService

```typescript
import { TestService } from '@/lib/db-service';

// Get all tests
const { data, error } = await TestService.getAll();

// Get a specific test
const { data, error } = await TestService.getById('some-uuid');

// Create a new test
const { data, error } = await TestService.create({
  name: 'New Test',
  description: 'A test record',
  value: 100
});

// Update a test
const { data, error } = await TestService.update('some-uuid', {
  name: 'Updated Name'
});

// Delete a test
const { data, error } = await TestService.delete('some-uuid');
```

## Server-Side Usage

In server components or API routes, you can use the same services. For server-side operations that require admin privileges, use the service role key:

```typescript
// In an API route
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Perform admin operations
const { data, error } = await supabase
  .from('test')
  .select('*')
  .eq('is_active', true);
```

## API Routes

The project includes a sample API route at `/api/tests` that demonstrates server-side database operations:

- `GET /api/tests` - Get all tests
- `POST /api/tests` - Create a new test

Example usage:

```javascript
// Fetch all tests
const response = await fetch('/api/tests');
const { data } = await response.json();

// Create a new test
const response = await fetch('/api/tests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'API Test',
    description: 'Created via API',
    value: 200
  })
});
```

## Real-time Subscriptions

The database service includes support for real-time subscriptions:

```typescript
import { TestService } from '@/lib/db-service';

// Subscribe to changes
const subscription = TestService.subscribe((payload) => {
  console.log('Change detected:', payload);
  // Refresh your UI here
});

// Don't forget to unsubscribe when component unmounts
// subscription.unsubscribe();
```

## Best Practices

1. **Error Handling**: Always check for errors in database operations
2. **Type Safety**: Use the generated TypeScript types in `types/database.types.ts`
3. **Security**: Use the anon key for client-side read operations and service role key for server-side admin operations
4. **Real-time**: Use subscriptions for live updates instead of polling
5. **Cleanup**: Always unsubscribe from real-time channels when components unmount

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure all required variables are in `.env.local`
   - Restart your development server after adding variables

2. **"Missing table"**
   - Verify the table exists in your Supabase database
   - Check that RLS policies allow the operation

3. **"Operation not allowed"**
   - Check RLS policies in Supabase dashboard
   - Use service role key for admin operations

### Getting Help

For database-related issues, check:
- [Supabase Documentation](https://supabase.com/docs)
- Project's GitHub issues

---

Last updated: July 2025
