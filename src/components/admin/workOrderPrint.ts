import { format } from 'date-fns';
import type { WorkOrderSubmission } from '@/hooks/useSubmissions';

const esc = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const val = (value: string | null | undefined): string => esc(value || 'N/A');

const paymentMethods: Record<string, string> = {
  check: 'Check',
  cash: 'Cash',
  credit_card: 'Credit Card',
  bill_navien: 'Bill Navien',
};

const billingStatuses: Record<string, string> = {
  estimate_needed: 'Estimate Needed',
  email_paid_invoice: 'Email Paid Invoice',
  bill_customer: 'Bill Customer',
  parts_ordered: 'Parts Ordered - Make Appointment',
};

const row = (label: string, value: string) =>
  `<p><span class="l">${esc(label)}:</span> ${value}</p>`;

export const buildWorkOrderPrintHtml = (s: WorkOrderSubmission): string => {
  const created = s.created_at
    ? format(new Date(s.created_at), 'MMM d, yyyy h:mm a')
    : 'N/A';

  const photos =
    s.photos && s.photos.length > 0
      ? `<div class="section"><h2>Photos (${s.photos.length})</h2><div class="photos">${s.photos
          .map((url) => `<img src="${esc(url)}" alt="Work order photo" />`)
          .join('')}</div></div>`
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Work Order - ${val(s.customer_name)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #000; background: #fff; margin: 24px; font-size: 12px; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  h2 { font-size: 13px; margin: 0 0 6px; border-bottom: 1px solid #000; padding-bottom: 3px; }
  .meta { font-size: 11px; margin-bottom: 16px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .section { margin-bottom: 14px; break-inside: avoid; }
  .full { grid-column: 1 / -1; }
  p { margin: 2px 0; }
  .l { font-weight: bold; }
  .box { border: 1px solid #999; padding: 8px; white-space: pre-wrap; }
  .photos { display: flex; flex-wrap: wrap; gap: 8px; }
  .photos img { width: 150px; height: 150px; object-fit: cover; border: 1px solid #999; break-inside: avoid; }
  @page { margin: 12mm; }
</style>
</head>
<body>
  <h1>Work Order - ${val(s.customer_name)}</h1>
  <div class="meta">Status: ${val(s.status)} &nbsp;|&nbsp; Submitted: ${esc(created)}</div>
  <div class="grid">
    <div class="section">
      <h2>Customer Info</h2>
      ${row('Name', val(s.customer_name))}
      ${row('Address', `${val(s.street_address)}${s.apt_number ? `, Apt ${esc(s.apt_number)}` : ''}`)}
      ${row('Phone', val(s.phone))}
      ${row('Zip Code', val(s.zip_code))}
      ${row('Email', val(s.email))}
      ${s.email_to ? row('CC Email', esc(s.email_to)) : ''}
      ${s.calendar_info ? row('Calendar Info', esc(s.calendar_info)) : ''}
    </div>
    <div class="section">
      <h2>Job Details</h2>
      ${row('Boiler Type', val(s.boiler_type))}
      ${row('Error Code', val(s.error_code))}
      ${row('Make &amp; Model', val(s.make_model))}
      ${row('Serial #', val(s.serial_number))}
      ${row('RGA# &amp; Navien Tech', val(s.rga_navien_tech))}
      ${row('Water Sampling PH', val(s.water_sampling_ph))}
      ${row('Parts Under Warranty', val(s.parts_under_warranty))}
    </div>
    <div class="section full">
      <h2>Job Description</h2>
      <div class="box">${val(s.job_description)}</div>
    </div>
    ${
      s.recommendations
        ? `<div class="section full"><h2>Recommendations</h2><div class="box">${esc(s.recommendations)}</div></div>`
        : ''
    }
    <div class="section">
      <h2>Technician Info</h2>
      ${row('Tech On Job', val(s.tech_on_job))}
      ${row('Hours On Job', val(s.hours_on_job))}
      ${row('Date', val(s.job_date))}
      ${row('Job Completed', val(s.job_completed))}
    </div>
    <div class="section">
      <h2>Billing Info</h2>
      ${row('Payment Method', val(s.payment_method ? paymentMethods[s.payment_method] || s.payment_method : null))}
      ${row('Billing Status', val(s.billing_status ? billingStatuses[s.billing_status] || s.billing_status : null))}
      ${row('Total Charges', val(s.total_charges))}
    </div>
    <div class="full">${photos}</div>
  </div>
</body>
</html>`;
};

export const printWorkOrder = (submission: WorkOrderSubmission): boolean => {
  const win = window.open('', '_blank', 'width=900,height=1000');
  if (!win) return false;
  win.document.open();
  win.document.write(buildWorkOrderPrintHtml(submission));
  win.document.close();
  win.focus();
  const trigger = () => {
    win.print();
  };
  if (win.document.readyState === 'complete') {
    setTimeout(trigger, 300);
  } else {
    win.onload = () => setTimeout(trigger, 300);
  }
  return true;
};
