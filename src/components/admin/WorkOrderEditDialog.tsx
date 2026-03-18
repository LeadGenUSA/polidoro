import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { WorkOrderSubmission } from '@/hooks/useSubmissions';

interface WorkOrderEditDialogProps {
  submission: WorkOrderSubmission;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, data: Partial<WorkOrderSubmission>) => Promise<void>;
}

const NONE_VALUE = '__none__';

export const WorkOrderEditDialog = ({ submission, open, onOpenChange, onSave }: WorkOrderEditDialogProps) => {
  const [form, setForm] = useState<Partial<WorkOrderSubmission>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ ...submission });
    }
  }, [open, submission]);

  const update = (field: keyof WorkOrderSubmission, value: string) => {
    setForm(prev => ({ ...prev, [field]: value || null }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { id, status, created_at, photos, ...editable } = form as WorkOrderSubmission;
      await onSave(submission.id, editable);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof WorkOrderSubmission, opts?: { textarea?: boolean }) => (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {opts?.textarea ? (
        <Textarea
          value={(form[key] as string) || ''}
          onChange={e => update(key, e.target.value)}
          rows={3}
        />
      ) : (
        <Input
          value={(form[key] as string) || ''}
          onChange={e => update(key, e.target.value)}
        />
      )}
    </div>
  );

  const selectField = (label: string, key: keyof WorkOrderSubmission, options: { value: string; label: string }[]) => (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Select
        value={(form[key] as string) || NONE_VALUE}
        onValueChange={v => update(key, v === NONE_VALUE ? '' : v)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_VALUE}>— None —</SelectItem>
          {options.map(o => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Work Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h4 className="font-semibold text-sm text-primary border-b pb-1 mb-3">Customer Info</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field('Customer Name', 'customer_name')}
              {field('Street Address', 'street_address')}
              {field('Apt #', 'apt_number')}
              {field('Phone', 'phone')}
              {field('Zip Code', 'zip_code')}
              {field('Email', 'email')}
              {field('CC Email', 'email_to')}
              {field('Calendar Info', 'calendar_info', { textarea: true })}
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h4 className="font-semibold text-sm text-primary border-b pb-1 mb-3">Job Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectField('Boiler Type', 'boiler_type', [
                { value: 'Navien', label: 'Navien' },
                { value: 'BOSCH', label: 'BOSCH' },
                { value: 'Burnham', label: 'Burnham' },
                { value: 'Weil McLain', label: 'Weil McLain' },
                { value: 'Plumbing/Heating Repair', label: 'Plumbing/Heating Repair' },
                { value: 'Other', label: 'Other' },
              ])}
              {field('Error Code', 'error_code')}
              {field('Make & Model', 'make_model')}
              {field('Serial #', 'serial_number')}
              {field('RGA# & Navien Tech', 'rga_navien_tech')}
              {field('Water Sampling PH', 'water_sampling_ph')}
              {field('Parts Under Warranty', 'parts_under_warranty')}
            </div>
            <div className="mt-3 space-y-3">
              {field('Job Description', 'job_description', { textarea: true })}
              {field('Recommendations', 'recommendations', { textarea: true })}
            </div>
          </div>

          {/* Technician Info */}
          <div>
            <h4 className="font-semibold text-sm text-primary border-b pb-1 mb-3">Technician Info</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field('Tech On Job', 'tech_on_job')}
              {field('Hours On Job', 'hours_on_job')}
              {field('Job Date', 'job_date')}
              {selectField('Job Completed', 'job_completed', [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ])}
            </div>
          </div>

          {/* Billing Info */}
          <div>
            <h4 className="font-semibold text-sm text-primary border-b pb-1 mb-3">Billing Info</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectField('Payment Method', 'payment_method', [
                { value: 'check', label: 'Check' },
                { value: 'cash', label: 'Cash' },
                { value: 'credit_card', label: 'Credit Card' },
                { value: 'bill_navien', label: 'Bill Navien' },
              ])}
              {selectField('Billing Status', 'billing_status', [
                { value: 'estimate_needed', label: 'Estimate Needed' },
                { value: 'email_paid_invoice', label: 'Email Paid Invoice' },
                { value: 'bill_customer', label: 'Bill Customer' },
                { value: 'parts_ordered', label: 'Parts Ordered - Make Appointment' },
              ])}
              {field('Total Charges', 'total_charges')}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
