import { fetchTableData, fetchById, insertRecord, updateRecord, deleteRecord } from '@/lib/supabase/db';
import type { Payment, PaymentStatus, PaymentInsert, PaymentWithRelations } from '@/types/database.types';

const TABLES = {
  PAYMENTS: 'payments' as const,
} as const;

export async function getPayments(
  filters: Partial<Payment> = {},
  options: {
    limit?: number;
    offset?: number;
    orderBy?: { column: string; ascending: boolean };
  } = {}
): Promise<{ data: PaymentWithRelations[] | null; error: Error | null }> {
  return fetchTableData(
    TABLES.PAYMENTS,
    {
      columns: '*, retailer:retailers(*), invoice:invoices(*)',
      filters,
      ...options,
    }
  ) as Promise<{ data: PaymentWithRelations[] | null; error: Error | null }>;
}

export async function getPaymentById(
  id: string
): Promise<{ data: PaymentWithRelations | null; error: Error | null }> {
  return fetchById(
    TABLES.PAYMENTS,
    id,
    '*, retailer:retailers(*), invoice:invoices(*)'
  ) as Promise<{ data: PaymentWithRelations | null; error: Error | null }>;
}

export async function createPayment(paymentData: {
  payment_number: string;
  invoice_id?: string | null;
  retailer_id?: string | null;
  amount: number;
  payment_method?: string | null;
  payment_date?: string | null;
  status?: PaymentStatus | null;
  reference_number?: string | null;
  notes?: string | null;
  is_same_day?: boolean | null;
  created_by?: string | null;
  gateway_transaction_id?: string | null;
  gateway_name?: string | null;
}): Promise<{ data: PaymentWithRelations | null; error: Error | null }> {
  try {
    const { data: paymentResult, error } = await insertRecord(
      TABLES.PAYMENTS,
      paymentData as never
    );
    
    if (error || !paymentResult) {
      return { data: null, error: error || new Error('Failed to create payment') };
    }
    
    // Fetch the complete payment with all relations
    return getPaymentById(paymentResult.id);
  } catch (error) {
    console.error('Error in createPayment:', error);
    return { data: null, error: error as Error };
  }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus
): Promise<{ data: Payment | null; error: Error | null }> {
  return updateRecord(
    TABLES.PAYMENTS,
    paymentId,
    { 
      status,
      updated_at: new Date().toISOString()
    } as Partial<Payment>
  );
}

export async function updatePayment(
  paymentId: string,
  updates: Partial<Payment>
): Promise<{ data: Payment | null; error: Error | null }> {
  return updateRecord(
    TABLES.PAYMENTS,
    paymentId,
    {
      ...updates,
      updated_at: new Date().toISOString()
    } as Partial<Payment>
  );
}

export async function deletePayment(
  paymentId: string
): Promise<{ error: Error | null }> {
  return deleteRecord(TABLES.PAYMENTS, paymentId);
}

export async function getPaymentsByRetailer(
  retailerId: string,
  status?: PaymentStatus
): Promise<{ data: PaymentWithRelations[] | null; error: Error | null }> {
  const filters: Record<string, unknown> = { retailer_id: retailerId };
  
  if (status) {
    filters.status = status;
  }
  
  return fetchTableData(
    TABLES.PAYMENTS,
    {
      columns: '*, retailer:retailers(*), invoice:invoices(*)',
      filters,
      orderBy: { column: 'payment_date', ascending: false },
    }
  ) as Promise<{ data: PaymentWithRelations[] | null; error: Error | null }>;
}

export async function getPaymentsByInvoice(
  invoiceId: string
): Promise<{ data: PaymentWithRelations[] | null; error: Error | null }> {
  return fetchTableData(
    TABLES.PAYMENTS,
    {
      columns: '*, retailer:retailers(*), invoice:invoices(*)',
      filters: { invoice_id: invoiceId },
      orderBy: { column: 'payment_date', ascending: false },
    }
  ) as Promise<{ data: PaymentWithRelations[] | null; error: Error | null }>;
}

export async function getSameDayPayments(): Promise<{ data: PaymentWithRelations[] | null; error: Error | null }> {
  return fetchTableData(
    TABLES.PAYMENTS,
    {
      columns: '*, retailer:retailers(*), invoice:invoices(*)',
      filters: { is_same_day: true },
      orderBy: { column: 'payment_date', ascending: false },
    }
  ) as Promise<{ data: PaymentWithRelations[] | null; error: Error | null }>;
}

export async function generatePaymentNumber(): Promise<string> {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PAY-${timestamp}-${random}`;
}
