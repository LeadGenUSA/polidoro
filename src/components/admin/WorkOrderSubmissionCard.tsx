import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Archive, 
  Trash2,
  MapPin,
  Phone,
  Wrench,
  Image
} from 'lucide-react';
import type { WorkOrderSubmission, SubmissionStatus } from '@/hooks/useSubmissions';

interface WorkOrderSubmissionCardProps {
  submission: WorkOrderSubmission;
  onUpdateStatus: (id: string, status: SubmissionStatus) => void;
  onDelete: (id: string) => void;
}

const formatValue = (value: string | null | undefined): string => {
  return value || 'N/A';
};

const formatPaymentMethod = (method: string | null): string => {
  const methods: Record<string, string> = {
    check: 'Check',
    cash: 'Cash',
    credit_card: 'Credit Card',
    bill_navien: 'Bill Navien',
  };
  return method ? methods[method] || method : 'N/A';
};

const formatBillingStatus = (status: string | null): string => {
  const statuses: Record<string, string> = {
    estimate_needed: 'Estimate Needed',
    email_paid_invoice: 'Email Paid Invoice',
    bill_customer: 'Bill Customer',
    parts_ordered: 'Parts Ordered - Make Appointment',
  };
  return status ? statuses[status] || status : 'N/A';
};

export const WorkOrderSubmissionCard = ({ 
  submission, 
  onUpdateStatus, 
  onDelete 
}: WorkOrderSubmissionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusColors: Record<SubmissionStatus, string> = {
    new: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-600',
  };

  return (
    <Card className={`${submission.status === 'archived' ? 'opacity-60' : ''}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={statusColors[submission.status]}>
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(submission.created_at), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              <h3 className="font-semibold text-foreground">{submission.customer_name}</h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {submission.street_address}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {submission.phone}
                </span>
                {submission.tech_on_job && (
                  <span className="flex items-center gap-1">
                    <Wrench className="w-3 h-3" />
                    {submission.tech_on_job}
                  </span>
                )}
              </div>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Customer Info */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Customer Info</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Name:</span> {submission.customer_name}</p>
                  <p><span className="font-medium">Address:</span> {submission.street_address}{submission.apt_number ? `, Apt ${submission.apt_number}` : ''}</p>
                  <p><span className="font-medium">Phone:</span> {submission.phone}</p>
                  <p><span className="font-medium">Zip Code:</span> {submission.zip_code}</p>
                  <p><span className="font-medium">Email:</span> {submission.email}</p>
                  {submission.email_to && <p><span className="font-medium">CC Email:</span> {submission.email_to}</p>}
                  {submission.calendar_info && <p><span className="font-medium">Calendar Info:</span> {submission.calendar_info}</p>}
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Job Details</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Error Code:</span> {formatValue(submission.error_code)}</p>
                  <p><span className="font-medium">Make & Model:</span> {formatValue(submission.make_model)}</p>
                  <p><span className="font-medium">Serial #:</span> {formatValue(submission.serial_number)}</p>
                  <p><span className="font-medium">RGA# & Navien Tech:</span> {formatValue(submission.rga_navien_tech)}</p>
                  <p><span className="font-medium">Water Sampling PH:</span> {formatValue(submission.water_sampling_ph)}</p>
                  <p><span className="font-medium">Parts Under Warranty:</span> {formatValue(submission.parts_under_warranty)}</p>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2 md:col-span-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Job Description</h4>
                <p className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">{submission.job_description}</p>
              </div>

              {/* Recommendations */}
              {submission.recommendations && (
                <div className="space-y-2 md:col-span-2">
                  <h4 className="font-semibold text-sm text-primary border-b pb-1">Recommendations</h4>
                  <p className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">{submission.recommendations}</p>
                </div>
              )}

              {/* Technician Info */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Technician Info</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Tech On Job:</span> {formatValue(submission.tech_on_job)}</p>
                  <p><span className="font-medium">Hours On Job:</span> {formatValue(submission.hours_on_job)}</p>
                  <p><span className="font-medium">Date:</span> {formatValue(submission.job_date)}</p>
                  <p><span className="font-medium">Job Completed:</span> {formatValue(submission.job_completed)}</p>
                </div>
              </div>

              {/* Billing Info */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Billing Info</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Payment Method:</span> {formatPaymentMethod(submission.payment_method)}</p>
                  <p><span className="font-medium">Billing Status:</span> {formatBillingStatus(submission.billing_status)}</p>
                  <p><span className="font-medium">Total Charges:</span> {formatValue(submission.total_charges)}</p>
                </div>
              </div>
            </div>

            {/* Photos */}
            {submission.photos && submission.photos.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-sm text-primary border-b pb-1 mb-2 flex items-center gap-1">
                  <Image className="w-4 h-4" />
                  Photos ({submission.photos.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {submission.photos.map((url, index) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={url} 
                        alt={`Photo ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border hover:opacity-80 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t">
              {submission.status !== 'reviewed' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-green-600 hover:text-green-700"
                  onClick={() => onUpdateStatus(submission.id, 'reviewed')}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark Reviewed
                </Button>
              )}
              {submission.status !== 'archived' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onUpdateStatus(submission.id, 'archived')}
                >
                  <Archive className="w-4 h-4 mr-1" />
                  Archive
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                className="text-red-600 hover:text-red-700 ml-auto"
                onClick={() => onDelete(submission.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
