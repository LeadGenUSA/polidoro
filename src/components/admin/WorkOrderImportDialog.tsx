import { useMemo, useRef, useState } from 'react';
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

  const records: WorkOrderInsert[] = useMemo(
    () => (headers.length ? rowsToWorkOrders(rows, headers) : []),
    [rows, headers]
  );

  const summary = useMemo(() => (headers.length ? buildHeaderMapping(headers) : null), [headers]);

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
    if (records.length === 0) return;
    setIsImporting(true);
    try {
      const chunkSize = 100;
      for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize).map((r) => ({ ...r, status: 'imported' as const }));
        const { error } = await supabase.from('work_order_submissions').insert(chunk);
        if (error) throw error;
      }
      toast({ title: 'Import complete', description: `${records.length} work orders added to the Imported tab.` });
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
