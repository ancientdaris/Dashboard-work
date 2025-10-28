import React, { useEffect, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Box } from '../../../../components/ui/box';
import { VStack } from '../../../../components/ui/vstack';
import { HStack } from '../../../../components/ui/hstack';
import { Heading } from '../../../../components/ui/heading';
import { Text } from '../../../../components/ui/text';
import { Card } from '../../../../components/ui/card';
import { Spinner } from '../../../../components/ui/spinner';
import { Badge, BadgeText } from '../../../../components/ui/badge';
import { Button, ButtonText } from '../../../../components/ui/button';
import { Divider } from '../../../../components/ui/divider';
import { supabase } from '../../../../lib/supabase';
import { Database } from '../../../../lib/database.types';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Printer, Share2 } from 'lucide-react-native';

type Invoice = Database['public']['Tables']['invoices']['Row'] & {
  retailers?: Database['public']['Tables']['retailers']['Row'];
  orders?: Database['public']['Tables']['orders']['Row'];
};

export const InvoiceDetailScreen = ({ route, navigation }: any) => {
  const { invoiceId } = route.params;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, retailers (*), orders (*)')
        .eq('id', invoiceId)
        .single();
      if (error) throw error;
      setInvoice(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    await supabase.from('invoices').update({ status: newStatus }).eq('id', invoiceId);
    fetchInvoiceDetails();
  };

  const printInvoice = async () => {
    if (!invoice) return;

    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 40px;
                color: #333;
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 3px solid #6366f1;
                padding-bottom: 20px;
              }
              .header h1 {
                color: #6366f1;
                margin: 0;
                font-size: 32px;
              }
              .invoice-number {
                font-size: 18px;
                color: #666;
                margin-top: 10px;
              }
              .info-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
              }
              .info-block {
                width: 48%;
              }
              .info-block h3 {
                color: #6366f1;
                font-size: 14px;
                text-transform: uppercase;
                margin-bottom: 10px;
              }
              .info-block p {
                margin: 5px 0;
                font-size: 14px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th {
                background-color: #6366f1;
                color: white;
                padding: 12px;
                text-align: left;
                font-size: 14px;
              }
              td {
                border: 1px solid #ddd;
                padding: 10px;
                font-size: 14px;
              }
              .totals {
                float: right;
                width: 300px;
                margin-top: 20px;
              }
              .totals-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                font-size: 14px;
              }
              .totals-row.total {
                border-top: 2px solid #333;
                margin-top: 10px;
                padding-top: 10px;
                font-size: 18px;
                font-weight: bold;
              }
              .footer {
                margin-top: 60px;
                text-align: center;
                color: #666;
                font-size: 12px;
                border-top: 1px solid #ddd;
                padding-top: 20px;
              }
              .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
              }
              .status-paid { background-color: #10b981; color: white; }
              .status-sent { background-color: #3b82f6; color: white; }
              .status-draft { background-color: #64748b; color: white; }
              .status-overdue { background-color: #ef4444; color: white; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>INVOICE</h1>
              <div class="invoice-number">${invoice.invoice_number}</div>
              <span class="status-badge status-${invoice.status}">${invoice.status}</span>
            </div>

            <div class="info-section">
              <div class="info-block">
                <h3>Bill To:</h3>
                <p><strong>${invoice.retailers?.name || 'N/A'}</strong></p>
                ${invoice.retailers?.email ? `<p>Email: ${invoice.retailers.email}</p>` : ''}
                ${invoice.retailers?.phone ? `<p>Phone: ${invoice.retailers.phone}</p>` : ''}
                ${invoice.retailers?.address ? `<p>Address: ${invoice.retailers.address}</p>` : ''}
              </div>

              <div class="info-block">
                <h3>Invoice Details:</h3>
                <p><strong>Issue Date:</strong> ${new Date(invoice.issue_date).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</p>
                ${invoice.orders ? `<p><strong>Order #:</strong> ${invoice.orders.order_number}</p>` : ''}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Products & Services</td>
                  <td style="text-align: right;">$${Number(invoice.subtotal).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div class="totals">
              <div class="totals-row">
                <span>Subtotal:</span>
                <span>$${Number(invoice.subtotal).toFixed(2)}</span>
              </div>
              ${invoice.tax_amount ? `
              <div class="totals-row">
                <span>Tax:</span>
                <span>$${Number(invoice.tax_amount).toFixed(2)}</span>
              </div>` : ''}
              ${invoice.discount_amount && Number(invoice.discount_amount) > 0 ? `
              <div class="totals-row">
                <span>Discount:</span>
                <span>-$${Number(invoice.discount_amount).toFixed(2)}</span>
              </div>` : ''}
              <div class="totals-row total">
                <span>Total:</span>
                <span>$${Number(invoice.total_amount).toFixed(2)}</span>
              </div>
            </div>

            <div style="clear: both;"></div>

            ${invoice.notes ? `
            <div style="margin-top: 40px;">
              <h3>Notes:</h3>
              <p>${invoice.notes}</p>
            </div>` : ''}

            <div class="footer">
              <p>Thank you for your business!</p>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Invoice ${invoice.invoice_number}`,
        });
      } else {
        Alert.alert('Success', 'Invoice PDF created successfully!');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to generate PDF: ' + error.message);
    }
  };

  if (loading) return <Box className="flex-1 justify-center items-center"><Spinner size="large" /></Box>;
  if (!invoice) return <Box className="flex-1 justify-center items-center p-4"><Text>Invoice not found</Text></Box>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Box className="p-4">
        <VStack space="lg">
          {/* Action Buttons */}
          <HStack space="md">
            <Button
              onPress={printInvoice}
              className="flex-1 bg-primary-600"
            >
              <HStack space="xs" className="items-center">
                <Printer color="#ffffff" size={18} />
                <ButtonText>Print / Share PDF</ButtonText>
              </HStack>
            </Button>
          </HStack>

          <Card className="p-4">
            <VStack space="md">
              <HStack className="justify-between items-center">
                <Heading className="text-2xl">{invoice.invoice_number}</Heading>
                <Badge action={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'error' : 'info'}>
                  <BadgeText>{invoice.status}</BadgeText>
                </Badge>
              </HStack>
              <Divider />
              <VStack space="sm">
                <Text className="text-sm text-typography-600">Customer</Text>
                <Text className="text-xl font-bold">{invoice.retailers?.name || 'Unknown'}</Text>
              </VStack>
            </VStack>
          </Card>

          <Card className="p-4">
            <VStack space="md">
              <Heading className="text-base">Invoice Details</Heading>
              <Divider />
              <HStack className="justify-between"><Text>Issue Date</Text><Text>{new Date(invoice.issue_date).toLocaleDateString()}</Text></HStack>
              <HStack className="justify-between"><Text>Due Date</Text><Text>{new Date(invoice.due_date).toLocaleDateString()}</Text></HStack>
              <HStack className="justify-between"><Text>Subtotal</Text><Text>${Number(invoice.subtotal).toFixed(2)}</Text></HStack>
              <HStack className="justify-between"><Text>Tax</Text><Text>${Number(invoice.tax_amount).toFixed(2)}</Text></HStack>
              <HStack className="justify-between"><Text>Discount</Text><Text className="text-error-600">-${Number(invoice.discount_amount).toFixed(2)}</Text></HStack>
              <Divider />
              <HStack className="justify-between"><Text className="font-bold text-xl">Total</Text><Text className="font-bold text-xl text-success-600">${Number(invoice.total_amount).toFixed(2)}</Text></HStack>
            </VStack>
          </Card>

          {invoice.notes && (
            <Card className="p-4">
              <VStack space="md">
                <Heading className="text-base">Notes</Heading>
                <Text>{invoice.notes}</Text>
              </VStack>
            </Card>
          )}

          <VStack space="md">
            <Button onPress={() => navigation.navigate('CreatePayment', { invoiceId: invoice.id })}>
              <ButtonText>Record Payment</ButtonText>
            </Button>
            {invoice.status === 'draft' && (
              <Button action="secondary" onPress={() => updateStatus('sent')}>
                <ButtonText>Mark as Sent</ButtonText>
              </Button>
            )}
            {invoice.status === 'sent' && (
              <Button action="positive" onPress={() => updateStatus('paid')}>
                <ButtonText>Mark as Paid</ButtonText>
              </Button>
            )}
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
};
