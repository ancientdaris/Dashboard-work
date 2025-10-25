import { createClient, SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// Type for table names
type TableName = keyof Database['public']['Tables'];

// Helper type to get the table row type
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];

// Helper type to get the table insert type
type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];

// Type for the result of database operations
type DbResult<T> = {
  data: T | null;
  error: Error | PostgrestError | null;
};

// Initialize the Supabase client with your project URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Fetches data from a table with optional filters and pagination
 * @param table The table name to query
 * @param options Configuration options for the query
 * @returns Promise with the query result
 */
export async function fetchTableData<T extends TableName>(
  table: T,
  options: {
    columns?: string;
    filters?: Partial<TableRow<T>>;
    orderBy?: { column: string; ascending: boolean };
    limit?: number;
    offset?: number;
  } = {}
): Promise<DbResult<TableRow<T>[]>> {
  try {
    const { columns = '*', filters = {}, orderBy, limit, offset } = options;
    
    // Initialize query with proper type
    let query = (supabase as SupabaseClient<Database>).from(table).select(columns);

    // Apply filters using match for exact equality on multiple columns
    if (filters && Object.keys(filters).length > 0) {
      query = query.match(filters as Partial<TableRow<T>>) as typeof query;
    }

    // Apply ordering
    if (orderBy && orderBy.column) {
      query = query.order(orderBy.column, { 
        ascending: orderBy.ascending 
      }) as typeof query;
    }

    // Apply pagination
    if (limit !== undefined) {
      query = query.limit(limit) as typeof query;
      
      if (offset !== undefined) {
        query = query.range(offset, offset + limit - 1) as typeof query;
      }
    }

    // Execute query with proper type assertion
    const { data, error } = await query as unknown as {
      data: TableRow<T>[] | null;
      error: Error | null;
    };
    
    if (error) throw error;
    if (!data) {
      return { data: null, error: new Error('No data returned') };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching from ${table}:`, error);
    return { data: null, error: error as Error };
  }
}

/**
 * Fetches a single record by ID
 * @param table The table name
 * @param id The ID of the record to fetch
 * @param columns Optional columns to select
 * @returns Promise with the query result
 */
export async function fetchById<T extends TableName>(
  table: T,
  id: string,
  columns: string = '*'
): Promise<DbResult<TableRow<T>>> {
  try {
    const { data, error } = await (supabase
      .from(table)
      .select(columns || '*')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .eq('id', id as never) as any) as { data: TableRow<T>[] | null; error: Error | null };

    if (error) throw error;
    return { 
      data: data && data.length > 0 ? data[0] : null, 
      error: null 
    };
  } catch (error) {
    console.error(`Error fetching ${table} with id ${id}:`, error);
    return { data: null, error: error as Error };
  }
}

/**
 * Inserts a new record into the specified table
 * @param table The table name
 * @param record The record data to insert
 * @returns Promise with the inserted record
 */
export async function insertRecord<T extends TableName>(
  table: T,
  record: Omit<TableInsert<T>, 'id' | 'created_at' | 'updated_at'>
): Promise<DbResult<TableRow<T>>> {
  try {
    const { data, error } = await (supabase
      .from(table)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(record as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .select() as any) as { data: TableRow<T>[] | null; error: Error | null };

    if (error) throw error;
    return { 
      data: data && data.length > 0 ? data[0] : null, 
      error: null 
    };
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error);
    return { data: null, error: error as Error };
  }
}

/**
 * Updates an existing record in the specified table
 * @param table The table name
 * @param id The ID of the record to update
 * @param updates The fields to update
 * @returns Promise with the updated record
 */
export async function updateRecord<T extends TableName>(
  table: T,
  id: string,
  updates: Partial<TableRow<T>>
): Promise<DbResult<TableRow<T>>> {
  try {
    const { data, error } = await (supabase
      .from(table)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(updates as any)
      .eq('id', id as never)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .select() as any) as { data: TableRow<T>[] | null; error: Error | null };

    if (error) throw error;
    return { 
      data: data && data.length > 0 ? data[0] : null, 
      error: null 
    };
  } catch (error) {
    console.error(`Error updating ${table} with id ${id}:`, error);
    return { data: null, error: error as Error };
  }
}

/**
 * Deletes a record from the specified table
 * @param table The table name
 * @param id The ID of the record to delete
 * @returns Promise with the operation result
 */
export async function deleteRecord<T extends TableName>(
  table: T,
  id: string
): Promise<{ error: Error | PostgrestError | null }> {
  try {
    const { error } = await (supabase as SupabaseClient<Database>)
      .from(table)
      .delete()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .eq('id', id as never) as any;
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error(`Error deleting from ${table} with id ${id}:`, error);
    return { error: error as Error };
  }
}

/**
 * Executes a custom SQL query
 * @param sql The SQL query string
 * @param params Optional query parameters
 * @returns Promise with the query result
 */
export async function executeSql<T = unknown>(
  sql: string,
  params?: Record<string, unknown>
): Promise<DbResult<T[]>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await ((supabase as SupabaseClient<Database>).rpc as any)('execute_sql', {
      query: sql,
      params: params || {}
    });

    const data = (response as { data: T[] | null }).data ?? null;
    const error = (response as { error: PostgrestError | null }).error;

    if (error) throw error;
    return { data: data ?? [], error: null };
  } catch (error) {
    console.error('Error executing SQL:', error);
    return { data: null, error: error as Error };
  }
}
