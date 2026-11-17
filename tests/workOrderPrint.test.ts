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