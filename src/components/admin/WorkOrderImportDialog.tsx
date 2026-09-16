import { useEffect, useMemo, useRef, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  parseCsv,
  rowsToWorkOrders,
  buildHeaderMapping,
  fieldLabel,
  type CsvRow,
  type WorkOrderInsert,
} from '@/lib/workOrderCsvImport';

const norm = (v: unknown) =>
  typeof v === 'string' ? v.trim().toLowerCase().replace(/\s+/g, ' ') : '';

/** Identifies the same customer across imports: email, else name + address. */
const duplicateKey = (record: Record<string, unknown>): string => {
  const email = norm(record.email);
  if (email) return `e:${email}`;
  const name = norm(record.customer_name);
  const address = norm(record.street_address);
  if (name && address) return `n:${name}|${address}`;
  return '';
};

interface WorkOrderImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: () => void;
}

export const WorkOrderImportDialog = ({ open, onOpenChange, onImported }: WorkOrderImportDialogProps) => {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const [duplicateMode, setDuplicateMode] = useState<'skip' | 'update' | 'all'>('skip');
  const [existingKeys, setExistingKeys] = useState<Map<string, string>>(new Map());

  const records: WorkOrderInsert[] = useMemo(
    () => (headers.length ? rowsToWorkOrders(rows, headers) : []),
    [rows, headers]
  );

  const summary = useMemo(() => (headers.length ? buildHeaderMapping(headers) : null), [headers]);

  // Load existing work orders so repeat customers can be detected.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('work_order_submissions')
        .select('id, email, customer_name, street_address');
      if (error || cancelled || !data) return;
      const map = new Map<string, string>();
      data.forEach((r) => {
        const key = duplicateKey(r);
        if (key && !map.has(key)) map.set(key, r.id);
      });
      setExistingKeys(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  // New rows, duplicates already in the database, and repeats inside the file itself.
  const split = useMemo(() => {
    const fresh: WorkOrderInsert[] = [];
    const updates: { id: string; record: WorkOrderInsert }[] = [];
    const seen = new Set<string>();
    let withinFile = 0;

    records.forEach((record) => {
      const key = duplicateKey(record as Record<string, unknown>);
      if (key && seen.has(key)) {
        withinFile += 1;
        if (duplicateMode === 'all') fresh.push(record);
        return;
      }
      if (key) seen.add(key);

      const existingId = key ? existingKeys.get(key) : undefined;
      if (existingId && duplicateMode !== 'all') {
        if (duplicateMode === 'update') updates.push({ id: existingId, record });
        return;
      }
      fresh.push(record);
    });

    return { fresh, updates, withinFile, existingMatches: updates.length };
  }, [records, existingKeys, duplicateMode]);

  const duplicateCount = useMemo(() => {
    const seen = new Set<string>();
    let count = 0;
    records.forEach((record) => {
      const key = duplicateKey(record as Record<string, unknown>);
      if (!key) return;
      if (seen.has(key) || existingKeys.has(key)) count += 1;
      seen.add(key);
    });
    return count;
  }, [records, existingKeys]);

  const totalToProcess = split.fresh.length + split.updates.length;

  const reset = () => {
    setFileName('');
    setHeaders([]);
    setRows([]);
    if (fileRef.current) fileRef.current.value = '';
  };


  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = parseCsv(text);
      if (parsed.headers.length === 0 || parsed.rows.length === 0) {
        toast({ title: 'Empty file', description: 'No rows were found in that file.', variant: 'destructive' });
        return;
      }
      setFileName(file.name);
      setHeaders(parsed.headers);
      setRows(parsed.rows);
    } catch (error) {
      console.error('CSV parse error:', error);
      toast({ title: 'Could not read file', description: 'Please check the file and try again.', variant: 'destructive' });
    }
  };

  const handleImport = async () => {
    if (totalToProcess === 0) return;
    setIsImporting(true);
    try {
      const chunkSize = 100;
      for (let i = 0; i < split.fresh.length; i += chunkSize) {
        const chunk = split.fresh.slice(i, i + chunkSize).map((r) => ({ ...r, status: 'imported' as const }));
        const { error } = await supabase.from('work_order_submissions').insert(chunk);
        if (error) throw error;
      }

      for (const { id, record } of split.updates) {
        const { error } = await supabase
          .from('work_order_submissions')
          .update({ ...record })
          .eq('id', id);
        if (error) throw error;
      }

      const parts = [`${split.fresh.length} added`];
      if (split.updates.length > 0) parts.push(`${split.updates.length} updated`);
      const skipped = records.length - totalToProcess;
      if (skipped > 0) parts.push(`${skipped} duplicate${skipped === 1 ? '' : 's'} skipped`);
      toast({ title: 'Import complete', description: parts.join(', ') + '.' });
      reset();
      onOpenChange(false);
      onImported();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Something went wrong during the import.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Work Orders from CSV</DialogTitle>
          <DialogDescription>
            Every column in your file is imported. Columns named like a work order field fill that field;
            all others are kept under their own heading. Imported records go to the Imported tab only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {headers.length > 0 && summary && (
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{fileName}</span> &mdash; {records.length} row
                {records.length === 1 ? '' : 's'} ready to import.
              </p>

              {summary.matched.length > 0 && (
                <p>
                  <span className="font-medium">Matched to work order fields:</span>{' '}
                  <span className="text-muted-foreground">
                    {summary.matched.map((m) => `${m.header} → ${fieldLabel(m.field)}`).join(', ')}
                  </span>
                </p>
              )}

              {summary.ignored.length > 0 && (
                <p>
                  <span className="font-medium">Kept as additional details:</span>{' '}
                  <span className="text-muted-foreground">{summary.ignored.join(', ')}</span>
                </p>
              )}

              <div className="rounded-md border p-3 space-y-3">
                <p className="font-medium">
                  {duplicateCount > 0
                    ? `${duplicateCount} row${duplicateCount === 1 ? '' : 's'} match a customer already on file`
                    : 'No duplicate customers found in this file'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Matched by email address, or by name and street address when there is no email.
                </p>
                <RadioGroup
                  value={duplicateMode}
                  onValueChange={(v) => setDuplicateMode(v as 'skip' | 'update' | 'all')}
                  className="space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="skip" id="dup-skip" />
                    <Label htmlFor="dup-skip" className="font-normal">Skip duplicates</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="update" id="dup-update" />
                    <Label htmlFor="dup-update" className="font-normal">
                      Update the existing record with the new details
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="all" id="dup-all" />
                    <Label htmlFor="dup-all" className="font-normal">Import everything, duplicates included</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <p className="font-medium mb-1">Preview (first 5 rows)</p>
                <div className="overflow-x-auto border rounded-md">
                  <table className="w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        {headers.map((header) => (
                          <th key={header} className="text-left p-2 whitespace-nowrap">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, 5).map((row, idx) => (
                        <tr key={idx} className="border-t">
                          {headers.map((header) => (
                            <td key={header} className="p-2 max-w-[200px] truncate">
                              {row[header] ?? ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isImporting}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={records.length === 0 || isImporting} className="gap-2">
            {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Import {records.length > 0 ? `${records.length} ` : ''}Work Orders
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
