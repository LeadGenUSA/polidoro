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
  Mail,
  Star,
  Calendar
} from 'lucide-react';
import type { SurveySubmission, SubmissionStatus } from '@/hooks/useSubmissions';

interface SurveySubmissionCardProps {
  submission: SurveySubmission;
  onUpdateStatus: (id: string, status: SubmissionStatus) => void;
  onDelete: (id: string) => void;
}

const formatRating = (value: string | null): string => {
  if (!value) return 'Not rated';
  return value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const getRatingColor = (value: string | null): string => {
  if (!value) return 'text-muted-foreground';
  if (value.includes('excellent') || value.includes('very_satisfied')) return 'text-green-600 font-semibold';
  if (value.includes('good') || value.includes('satisfied')) return 'text-lime-600';
  if (value.includes('average') || value.includes('neutral')) return 'text-yellow-600';
  if (value.includes('below') || value.includes('dissatisfied')) return 'text-orange-600';
  if (value.includes('poor') || value.includes('very_dissatisfied')) return 'text-red-600 font-semibold';
  return 'text-foreground';
};

const formatYesNo = (value: string | null): string => {
  if (!value) return 'Not answered';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const SurveySubmissionCard = ({ 
  submission, 
  onUpdateStatus, 
  onDelete 
}: SurveySubmissionCardProps) => {
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
                  <Mail className="w-3 h-3" />
                  {submission.email}
                </span>
                {submission.overall_satisfaction && (
                  <span className={`flex items-center gap-1 ${getRatingColor(submission.overall_satisfaction)}`}>
                    <Star className="w-3 h-3" />
                    {formatRating(submission.overall_satisfaction)}
                  </span>
                )}
                {submission.service_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {submission.service_date}
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
                  <p><span className="font-medium">Email:</span> {submission.email}</p>
                  <p><span className="font-medium">Phone:</span> {submission.phone || 'N/A'}</p>
                  <p><span className="font-medium">Service Date:</span> {submission.service_date || 'N/A'}</p>
                  <p><span className="font-medium">Technician:</span> {submission.technician_name || 'N/A'}</p>
                </div>
              </div>

              {/* Overall Satisfaction */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Overall Satisfaction</h4>
                <div className="text-sm">
                  <p className={getRatingColor(submission.overall_satisfaction)}>
                    {formatRating(submission.overall_satisfaction)}
                  </p>
                </div>
              </div>

              {/* Service Ratings */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Service Ratings</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Quality of Work:</span> <span className={getRatingColor(submission.quality_of_work)}>{formatRating(submission.quality_of_work)}</span></p>
                  <p><span className="font-medium">Timeliness:</span> <span className={getRatingColor(submission.timeliness)}>{formatRating(submission.timeliness)}</span></p>
                  <p><span className="font-medium">Professionalism:</span> <span className={getRatingColor(submission.professionalism)}>{formatRating(submission.professionalism)}</span></p>
                  <p><span className="font-medium">Communication:</span> <span className={getRatingColor(submission.communication)}>{formatRating(submission.communication)}</span></p>
                  <p><span className="font-medium">Value for Money:</span> <span className={getRatingColor(submission.value_for_money)}>{formatRating(submission.value_for_money)}</span></p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Recommendations</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Would Recommend:</span> {formatYesNo(submission.would_recommend)}</p>
                  <p><span className="font-medium">Would Use Again:</span> {formatYesNo(submission.use_again)}</p>
                </div>
              </div>

              {/* Sales Lead Questions */}
              <div className="space-y-2 md:col-span-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Sales Lead Questions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium">Estimate Overpriced?</span> {submission.estimate_overpriced === 'yes' ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Satisfied with Recommendation?</span> {submission.satisfied_with_recommendation === 'yes' ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Were We Professional?</span> {submission.were_we_professional === 'yes' ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Comfortable with Tech?</span> {submission.comfortable_with_tech === 'yes' ? 'Yes' : 'No'}</p>
                  <p className="md:col-span-2">
                    <span className="font-medium">Consider Installation?</span>{' '}
                    {submission.consider_installation === 'yes_call_me' 
                      ? 'Yes - Call Me' 
                      : submission.consider_installation === 'obtained_another' 
                        ? 'Obtained Another Plumber' 
                        : 'Not Doing Job Now'}
                  </p>
                </div>
              </div>

              {/* Additional Feedback */}
              {(submission.what_did_well || submission.areas_to_improve || submission.additional_comments) && (
                <div className="space-y-2 md:col-span-2">
                  <h4 className="font-semibold text-sm text-primary border-b pb-1">Additional Feedback</h4>
                  <div className="space-y-3">
                    {submission.what_did_well && (
                      <div>
                        <p className="text-sm font-medium">What We Did Well:</p>
                        <p className="text-sm bg-green-50 p-3 rounded border-l-3 border-green-500">{submission.what_did_well}</p>
                      </div>
                    )}
                    {submission.areas_to_improve && (
                      <div>
                        <p className="text-sm font-medium">Areas to Improve:</p>
                        <p className="text-sm bg-orange-50 p-3 rounded border-l-3 border-orange-500">{submission.areas_to_improve}</p>
                      </div>
                    )}
                    {submission.additional_comments && (
                      <div>
                        <p className="text-sm font-medium">Additional Comments:</p>
                        <p className="text-sm bg-muted p-3 rounded">{submission.additional_comments}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

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
