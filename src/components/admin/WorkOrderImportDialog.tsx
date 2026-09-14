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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  parseCsv,
  initialColumnMapping,
  rowsToWorkOrders,
  fieldLabel,
  WORK_ORDER_FIELDS,
  type ColumnMapping,
  type CsvRow,
  type WorkOrderField,
  type WorkOrderInsert,
} from '@/lib/workOrderCsvImport';

interface WorkOrderImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: () => void;
}

const NONE = '__none__';

export const WorkOrderImportDialog = ({ open, onOpenChange, onImported }: WorkOrderImportDialogProps) => {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [isImporting, setIsImporting] = useState(false);

  const records: WorkOrderInsert[] = useMemo(
    () => (headers.length ? rowsToWorkOrders(rows, headers, mapping) : []),
    [rows, headers, mapping]
  );

  const usedFields = useMemo(
    () => new Set(Object.values(mapping).filter(Boolean) as WorkOrderField[]),
    [mapping]
  );

  const previewFields = useMemo(
    () => WORK_ORDER_FIELDS.filter((f) => usedFields.has(f) || f === 'job_description'),
    [usedFields]
  );

  const reset = () => {
    setFileName('');
    setHeaders([]);
    setRows([]);
    setMapping({});
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
      setMapping(initialColumnMapping(parsed.headers));
    } catch (error) {
      console.error('CSV parse error:', error);
      toast({ title: 'Could not read file', description: 'Please check the file and try again.', variant: 'destructive' });
    }
  };

  const setColumn = (header: string, value: string) => {
    setMapping((prev) => ({ ...prev, [header]: value === NONE ? null : (value as WorkOrderField) }));
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
            Choose which work order field each column fills. Anything left unmapped is added to the job
            description. Imported records go to the Imported tab only.
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

          {headers.length > 0 && (
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{fileName}</span> &mdash; {records.length} row
                {records.length === 1 ? '' : 's'} ready to import.
              </p>

              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Column in your file</th>
                      <th className="text-left p-2">Example value</th>
                      <th className="text-left p-2">Work order field</th>
                    </tr>
                  </thead>
                  <tbody>
                    {headers.map((header) => (
                      <tr key={header} className="border-t">
                        <td className="p-2 font-medium whitespace-nowrap">{header}</td>
                        <td className="p-2 text-muted-foreground max-w-[220px] truncate">
                          {rows[0]?.[header] || '—'}
                        </td>
                        <td className="p-2">
                          <Select
                            value={mapping[header] ?? NONE}
                            onValueChange={(v) => setColumn(header, v)}
                          >
                            <SelectTrigger className="h-8 w-[240px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover z-50">
                              <SelectItem value={NONE}>Don't import (add to job notes)</SelectItem>
                              {WORK_ORDER_FIELDS.map((field) => (
                                <SelectItem
                                  key={field}
                                  value={field}
                                  disabled={usedFields.has(field) && mapping[header] !== field}
                                >
                                  {fieldLabel(field)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {records.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Preview (first 5 rows)</p>
                  <div className="overflow-x-auto border rounded-md">
                    <table className="w-full text-xs">
                      <thead className="bg-muted">
                        <tr>
                          {previewFields.map((field) => (
                            <th key={field} className="text-left p-2 whitespace-nowrap">
                              {fieldLabel(field)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {records.slice(0, 5).map((record, idx) => (
                          <tr key={idx} className="border-t">
                            {previewFields.map((field) => (
                              <td key={field} className="p-2 whitespace-pre-line max-w-[200px] truncate">
                                {record[field] ?? ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
