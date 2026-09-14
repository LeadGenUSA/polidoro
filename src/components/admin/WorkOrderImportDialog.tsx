import { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  parseCsv,
  buildHeaderMapping,
  rowsToWorkOrders,
  type HeaderMapping,
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
  const [mapping, setMapping] = useState<HeaderMapping | null>(null);
  const [records, setRecords] = useState<WorkOrderInsert[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const reset = () => {
    setFileName('');
    setMapping(null);
    setRecords([]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const { headers, rows } = parseCsv(text);
      if (headers.length === 0 || rows.length === 0) {
        toast({ title: 'Empty file', description: 'No rows were found in that file.', variant: 'destructive' });
        return;
      }
      const map = buildHeaderMapping(headers);
      if (map.matched.length === 0) {
        toast({
          title: 'No matching columns',
          description: 'None of the column headings matched work order fields.',
          variant: 'destructive',
        });
        return;
      }
      setFileName(file.name);
      setMapping(map);
      setRecords(rowsToWorkOrders(rows, map));
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
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Work Orders from CSV</DialogTitle>
          <DialogDescription>
            Column headings are matched automatically. Imported records go to the Imported tab only.
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

          {mapping && (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{fileName}</span> — {records.length} row
                {records.length === 1 ? '' : 's'} ready to import.
              </p>

              <div>
                <p className="font-medium mb-1">Matched columns ({mapping.matched.length})</p>
                <div className="flex flex-wrap gap-1">
                  {mapping.matched.map(({ header, field }) => (
                    <Badge key={header} variant="secondary">
                      {header} &rarr; {field.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {mapping.ignored.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Ignored columns ({mapping.ignored.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {mapping.ignored.map((header) => (
                      <Badge key={header} variant="outline">
                        {header}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {records.length > 0 && (
                <div className="overflow-x-auto border rounded-md">
                  <table className="w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        {mapping.matched.map(({ field }) => (
                          <th key={field} className="text-left p-2 whitespace-nowrap capitalize">
                            {field.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {records.slice(0, 5).map((record, idx) => (
                        <tr key={idx} className="border-t">
                          {mapping.matched.map(({ field }) => (
                            <td key={field} className="p-2 whitespace-nowrap max-w-[200px] truncate">
                              {record[field] ?? ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
