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
  DollarSign,
  Flame,
  Image
} from 'lucide-react';
import type { EstimateSubmission, SubmissionStatus } from '@/hooks/useSubmissions';

interface EstimateSubmissionCardProps {
  submission: EstimateSubmission;
  onUpdateStatus: (id: string, status: SubmissionStatus) => void;
  onDelete: (id: string) => void;
}

const formatValue = (value: string | string[] | null | undefined): string => {
  if (!value) return 'N/A';
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : 'N/A';
  return value;
};

export const EstimateSubmissionCard = ({ 
  submission, 
  onUpdateStatus, 
  onDelete 
}: EstimateSubmissionCardProps) => {
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
              <h3 className="font-semibold text-foreground">{submission.customer}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {submission.email}
                </span>
                {submission.cost_of_job && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {submission.cost_of_job}
                  </span>
                )}
                {submission.boiler_types && submission.boiler_types.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {submission.boiler_types.join(', ')}
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
                  <p><span className="font-medium">Customer:</span> {submission.customer}</p>
                  <p><span className="font-medium">Email:</span> {submission.email}</p>
                  <p><span className="font-medium">Cost of Job:</span> {formatValue(submission.cost_of_job)}</p>
                </div>
              </div>

              {/* Boiler Info */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Boiler Info</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Boiler Types:</span> {formatValue(submission.boiler_types)}</p>
                  <p><span className="font-medium">Boiler Size:</span> {formatValue(submission.boiler_size)}</p>
                  <p><span className="font-medium">Baseboard:</span> {formatValue(submission.baseboard)}</p>
                </div>
              </div>

              {/* Oil Tank - Buried */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Oil Tank - Buried</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Tank Size:</span> {formatValue(submission.buried_tank_size)}</p>
                  <p><span className="font-medium">Pump & Foam:</span> {formatValue(submission.pump_and_foam)}</p>
                  <p><span className="font-medium">Tank Sand:</span> {formatValue(submission.tank_sand)}</p>
                  <p><span className="font-medium">Price Additional:</span> {formatValue(submission.buried_price_additional)}</p>
                </div>
              </div>

              {/* Oil Tank - Interior */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Oil Tank - Interior</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Tank Removed:</span> {formatValue(submission.interior_tank_removed)}</p>
                  <p><span className="font-medium">Behind Wall:</span> {formatValue(submission.interior_tank_behind_wall)}</p>
                  <p><span className="font-medium">Price Additional:</span> {formatValue(submission.interior_price_additional)}</p>
                </div>
              </div>

              {/* Oil Tank - Exterior */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Oil Tank - Exterior</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">275 Removal:</span> {formatValue(submission.exterior_275_removal)}</p>
                  <p><span className="font-medium">Price Additional:</span> {formatValue(submission.exterior_price_additional)}</p>
                </div>
              </div>

              {/* Oil Tank - Other */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Oil Tank - Other</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Customer Responsible:</span> {formatValue(submission.customer_responsible_for_tank)}</p>
                  <p><span className="font-medium">Notes:</span> {formatValue(submission.tank_notes)}</p>
                </div>
              </div>

              {/* Installation Notes/Venting */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Installation Notes/Venting</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Steam System:</span> {formatValue(submission.steam_system)}</p>
                  <p><span className="font-medium">Thermostats:</span> {formatValue(submission.thermostats_included)}</p>
                  <p><span className="font-medium">Chimney Lined:</span> {formatValue(submission.existing_chimney_lined)}</p>
                  <p><span className="font-medium">Chimney Notes:</span> {formatValue(submission.chimney_lined_notes)}</p>
                  <p><span className="font-medium">Vent Location:</span> {formatValue(submission.vent_location)}</p>
                  <p><span className="font-medium">Vent Notes:</span> {formatValue(submission.vent_location_notes)}</p>
                  <p><span className="font-medium">Zones:</span> {formatValue(submission.number_of_zones)}</p>
                  <p><span className="font-medium">Zone Size:</span> {formatValue(submission.zone_size)}</p>
                  <p><span className="font-medium">Boiler Access:</span> {formatValue(submission.boiler_access)}</p>
                </div>
              </div>

              {/* Gas Service/Piping */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-primary border-b pb-1">Gas Service/Piping</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Gas Needed For:</span> {formatValue(submission.gas_needed_for)}</p>
                  <p><span className="font-medium">Gas in House:</span> {formatValue(submission.gas_in_house)}</p>
                  <p><span className="font-medium">Notes:</span> {formatValue(submission.gas_notes)}</p>
                  <p><span className="font-medium">Meter Location:</span> {formatValue(submission.meter_location)}</p>
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
