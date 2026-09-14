/**
 * Dependency-free CSV parsing + header mapping for work order imports.
 */

export type CsvRow = Record<string, string>;

export interface ParsedCsv {
  headers: string[];
  rows: CsvRow[];
}

/** Parses CSV text, handling quoted fields with embedded commas and newlines. */
export function parseCsv(text: string): ParsedCsv {
  const clean = text.replace(/^\uFEFF/, '');
  const records: string[][] = [];
  let field = '';
  let record: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];

    if (inQuotes) {
      if (char === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      record.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && clean[i + 1] === '\n') i++;
      record.push(field);
      field = '';
      records.push(record);
      record = [];
    } else {
      field += char;
    }
  }

  if (field.length > 0 || record.length > 0) {
    record.push(field);
    records.push(record);
  }

  const nonEmpty = records.filter((r) => r.some((c) => c.trim() !== ''));
  if (nonEmpty.length === 0) return { headers: [], rows: [] };

  const headers = nonEmpty[0].map((h) => h.trim());
  const rows = nonEmpty.slice(1).map((r) => {
    const row: CsvRow = {};
    headers.forEach((h, idx) => {
      row[h] = (r[idx] ?? '').trim();
    });
    return row;
  });

  return { headers, rows };
}

/** Work order columns that can be filled from a CSV. */
export const WORK_ORDER_FIELDS = [
  'customer_name',
  'street_address',
  'apt_number',
  'phone',
  'zip_code',
  'email',
  'email_to',
  'error_code',
  'make_model',
  'serial_number',
  'job_description',
  'recommendations',
  'rga_navien_tech',
  'water_sampling_ph',
  'parts_under_warranty',
  'tech_on_job',
  'hours_on_job',
  'job_date',
  'job_completed',
  'payment_method',
  'billing_status',
  'total_charges',
  'calendar_info',
  'boiler_type',
] as const;

export type WorkOrderField = (typeof WORK_ORDER_FIELDS)[number];

const normalizeHeader = (h: string) => h.toLowerCase().replace(/[\s_\-./#]+/g, '');

/** Extra header spellings that map onto a work order field. */
const HEADER_ALIASES: Record<string, WorkOrderField> = {
  customer: 'customer_name',
  customername: 'customer_name',
  name: 'customer_name',
  clientname: 'customer_name',
  address: 'street_address',
  streetaddress: 'street_address',
  street: 'street_address',
  apt: 'apt_number',
  aptnumber: 'apt_number',
  apartment: 'apt_number',
  unit: 'apt_number',
  phone: 'phone',
  phonenumber: 'phone',
  telephone: 'phone',
  zip: 'zip_code',
  zipcode: 'zip_code',
  postalcode: 'zip_code',
  email: 'email',
  emailaddress: 'email',
  emailto: 'email_to',
  ccemail: 'email_to',
  errorcode: 'error_code',
  error: 'error_code',
  makemodel: 'make_model',
  makeandmodel: 'make_model',
  model: 'make_model',
  serial: 'serial_number',
  serialnumber: 'serial_number',
  serialno: 'serial_number',
  jobdescription: 'job_description',
  description: 'job_description',
  workperformed: 'job_description',
  notes: 'job_description',
  recommendations: 'recommendations',
  recommendation: 'recommendations',
  rganavientech: 'rga_navien_tech',
  rga: 'rga_navien_tech',
  navientech: 'rga_navien_tech',
  watersamplingph: 'water_sampling_ph',
  waterph: 'water_sampling_ph',
  ph: 'water_sampling_ph',
  partsunderwarranty: 'parts_under_warranty',
  warranty: 'parts_under_warranty',
  techonjob: 'tech_on_job',
  tech: 'tech_on_job',
  technician: 'tech_on_job',
  techniciblename: 'tech_on_job',
  techniciannname: 'tech_on_job',
  technicianname: 'tech_on_job',
  hoursonjob: 'hours_on_job',
  hours: 'hours_on_job',
  jobdate: 'job_date',
  date: 'job_date',
  servicedate: 'job_date',
  jobcompleted: 'job_completed',
  completed: 'job_completed',
  paymentmethod: 'payment_method',
  payment: 'payment_method',
  billingstatus: 'billing_status',
  billing: 'billing_status',
  totalcharges: 'total_charges',
  total: 'total_charges',
  amount: 'total_charges',
  price: 'total_charges',
  calendarinfo: 'calendar_info',
  calendar: 'calendar_info',
  boilertype: 'boiler_type',
  boiler: 'boiler_type',
};

/** Maps a CSV header to a work order field, or null when unmatched. */
export function matchHeader(header: string): WorkOrderField | null {
  const key = normalizeHeader(header);
  if (!key) return null;
  const direct = WORK_ORDER_FIELDS.find((f) => normalizeHeader(f) === key);
  if (direct) return direct;
  return HEADER_ALIASES[key] ?? null;
}

export interface HeaderMapping {
  matched: { header: string; field: WorkOrderField }[];
  ignored: string[];
}

export function buildHeaderMapping(headers: string[]): HeaderMapping {
  const matched: HeaderMapping['matched'] = [];
  const ignored: string[] = [];
  const used = new Set<WorkOrderField>();

  headers.forEach((header) => {
    const field = matchHeader(header);
    if (field && !used.has(field)) {
      used.add(field);
      matched.push({ header, field });
    } else if (header.trim()) {
      ignored.push(header);
    }
  });

  return { matched, ignored };
}

export type WorkOrderInsert = Partial<Record<WorkOrderField, string>> & {
  extra_fields?: Record<string, string>;
};

/** Human friendly label for a work order field. */
export function fieldLabel(field: WorkOrderField): string {
  return field
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace('Rga', 'RGA');
}

/**
 * Converts CSV rows into work order records.
 * Headings matching a work order field fill it; every other column is kept
 * verbatim in extra_fields under its own heading.
 */
export function rowsToWorkOrders(rows: CsvRow[], headers: string[]): WorkOrderInsert[] {
  const auto = buildHeaderMapping(headers);
  const mapping: Record<string, WorkOrderField> = {};
  auto.matched.forEach(({ header, field }) => {
    mapping[header] = field;
  });

  return rows
    .map((row) => {
      const record: WorkOrderInsert = {};
      const extras: Record<string, string> = {};

      headers.forEach((header) => {
        const value = (row[header] ?? '').trim();
        if (!value) return;
        const field = mapping[header];
        if (field) {
          record[field] = value;
        } else if (header.trim()) {
          extras[header.trim()] = value;
        }
      });

      if (Object.keys(extras).length > 0) {
        record.extra_fields = extras;
      }

      return record;
    })
    .filter((r) => Object.keys(r).length > 0);
}

