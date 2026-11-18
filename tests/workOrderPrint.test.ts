import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildWorkOrderPrintHtml } from '../src/components/admin/workOrderPrint';
import type { WorkOrderSubmission } from '@/hooks/useSubmissions';

test('work order printing excludes all uploaded pictures', () => {
  const submission = {
    customer_name: 'Print Test',
    created_at: '2026-11-17T17:06:00Z',
    status: 'pending',
    photos: ['https://example.com/work-order-picture.jpg'],
  } as WorkOrderSubmission;
  const html = buildWorkOrderPrintHtml(submission);
  assert.equal(html.includes('<img'), false);
  assert.equal(html.includes(submission.photos?.[0] ?? 'missing-photo'), false);
  assert.ok(html.includes('Print Test'));
});

test('work order printing retains all non-photo details', () => {
  const details = {
    customer_name: 'Customer Example', street_address: '123 Example Street',
    apt_number: 'Suite 12', phone: '631-555-0100', zip_code: '11787',
    email: 'customer@example.com', email_to: 'office@example.com',
    calendar_info: 'Morning appointment', boiler_type: 'NCB240',
    error_code: 'E012', make_model: 'Model Example', serial_number: 'SN12345',
    rga_navien_tech: 'Reference 987', water_sampling_ph: '7.2',
    parts_under_warranty: 'Covered parts', job_description: 'Replace pump',
    recommendations: 'Annual inspection', tech_on_job: 'Technician Example',
    hours_on_job: '3.5', job_date: '2026-11-18', job_completed: 'Not completed',
    payment_method: 'cash', billing_status: 'bill_customer', total_charges: '275.00',
  };
  const html = buildWorkOrderPrintHtml({
    ...details, id: 'test-order', status: 'pending',
    created_at: '2026-11-18T02:21:00Z', photos: [],
    extra_fields: { 'Imported Note': 'Keep this imported information' },
  });
  for (const [field, value] of Object.entries(details)) {
    if (field === 'payment_method' || field === 'billing_status') continue;
    assert.ok(html.includes(value), `Missing printed detail: ${field}`);
  }
  assert.ok(html.includes('Cash'));
  assert.ok(html.includes('Bill Customer'));
  assert.ok(html.includes('Keep this imported information'));
});