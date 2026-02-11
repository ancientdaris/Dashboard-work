import { fetchTableData, fetchById, insertRecord, updateRecord, deleteRecord } from '@/lib/supabase/db';
import type { Retailer } from '@/types/database.types';

const TABLE_NAME = 'retailers' as const;

export async function getRetailers(
  filters: Partial<Retailer> = {},
  options: {
    limit?: number;
    offset?: number;
    orderBy?: { column: string; ascending: boolean };
  } = {}
) {
  return fetchTableData(
    TABLE_NAME,
    {
      columns: '*',
      filters,
      ...options,
    }
  );
}

export async function getRetailerById(id: string) {
  return fetchById(TABLE_NAME, id);
}

export async function createRetailer(retailer: Omit<Retailer, 'id' | 'created_at' | 'updated_at'>) {
  return insertRecord(TABLE_NAME, retailer as never);
}

export async function updateRetailer(id: string, updates: Partial<Retailer>) {
  return updateRecord(TABLE_NAME, id, updates);
}

export async function deleteRetailer(id: string) {
  return deleteRecord(TABLE_NAME, id);
}

export async function searchRetailers(query: string) {
  try {
    const { data, error } = await fetchTableData(
      TABLE_NAME,
      {
        columns: '*',
        filters: {
          name: `%${query}%`,
        },
        limit: 10,
      }
    );

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error searching retailers:', error);
    return { data: null, error: error as Error };
  }
}
