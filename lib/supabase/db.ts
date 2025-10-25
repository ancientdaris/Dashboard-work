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
    filters?: Record<string, unknown>;
    orderBy?: { column: string; ascending: boolean };
    limit?: number;
    offset?: number;
  } = {}
): Promise<DbResult<TableRow<T>[]>> {
  try {
    const { columns = '*', filters = {}, orderBy, limit, offset } = options;
    
    // Initialize query with proper type
    let query = (supabase as SupabaseClient<Database>).from(table).select(columns);

    // Apply filters
    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key as string, value as any);
        }
      });
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
    const { data, error } = await (supabase as any)
      .from(table)
      .select(columns)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data, error: null };
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
    const { data, error } = await (supabase as any)
      .from(table)
      .insert(record as any)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
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
    const { data, error } = await (supabase as any)
      .from(table)
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
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
    const { error } = await (supabase as any)
      .from(table)
      .delete()
      .eq('id', id);
    
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
    const { data, error } = await (supabase as any).rpc('execute_sql', {
      query: sql,
      params: params || {}
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error executing SQL:', error);
    return { data: null, error: error as Error };
  }
}
