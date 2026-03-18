import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  useSubmissions, 
  type SubmissionType, 
  type SubmissionStatus,
  type EstimateSubmission,
  type WorkOrderSubmission,
  type SurveySubmission
} from '@/hooks/useSubmissions';
import { EstimateSubmissionCard } from './EstimateSubmissionCard';
import { WorkOrderSubmissionCard } from './WorkOrderSubmissionCard';
import { SurveySubmissionCard } from './SurveySubmissionCard';
import { 
  FileText, 
  Wrench, 
  ClipboardList, 
  Download, 
  Clock, 
  CheckCircle, 
  Archive as ArchiveIcon,
  Star,
  Loader2,
  Search,
  Calendar
} from 'lucide-react';

export const SubmissionsManager = () => {
  const [submissionType, setSubmissionType] = useState<SubmissionType>('estimates');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('new');
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    submissions, 
    isLoading, 
    counts, 
    updateStatus, 
    updateWorkOrder,
    deleteSubmission, 
    exportToCSV,
    exportToICS
  } = useSubmissions(submissionType, statusFilter);

  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissions;
    const q = searchQuery.toLowerCase();
    return submissions.filter((s) => {
      if (submissionType === 'work_orders') {
        const wo = s as WorkOrderSubmission;
        return [wo.customer_name, wo.email, wo.street_address, wo.phone, wo.job_description, wo.tech_on_job, wo.make_model]
          .some(v => v?.toLowerCase().includes(q));
      }
      if (submissionType === 'estimates') {
        const est = s as EstimateSubmission;
        return [est.customer, est.email].some(v => v?.toLowerCase().includes(q));
      }
      const sur = s as SurveySubmission;
      return [sur.customer_name, sur.email, sur.technician_name].some(v => v?.toLowerCase().includes(q));
    });
  }, [submissions, searchQuery, submissionType]);

  const typeLabels: Record<SubmissionType, { label: string; icon: React.ReactNode }> = {
    estimates: { label: 'Estimates', icon: <FileText className="w-4 h-4" /> },
    work_orders: { label: 'Work Orders', icon: <Wrench className="w-4 h-4" /> },
    surveys: { label: 'Surveys', icon: <ClipboardList className="w-4 h-4" /> },
  };

  return (
    <div className="space-y-6">
      {/* Submission Type Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs 
          value={submissionType} 
          onValueChange={(v) => {
            setSubmissionType(v as SubmissionType);
            setStatusFilter('new');
          }}
        >
          <TabsList>
            <TabsTrigger value="estimates" className="gap-2">
              {typeLabels.estimates.icon}
              {typeLabels.estimates.label}
            </TabsTrigger>
            <TabsTrigger value="work_orders" className="gap-2">
              {typeLabels.work_orders.icon}
              {typeLabels.work_orders.label}
            </TabsTrigger>
            <TabsTrigger value="surveys" className="gap-2">
              {typeLabels.surveys.icon}
              {typeLabels.surveys.label}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          {submissionType === 'work_orders' && (
            <Button onClick={exportToICS} variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Export to Outlook
            </Button>
          )}
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${typeLabels[submissionType].label.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{counts.new}</p>
              <p className="text-sm text-muted-foreground">New</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{counts.reviewed}</p>
              <p className="text-sm text-muted-foreground">Reviewed</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <ArchiveIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{counts.archived}</p>
              <p className="text-sm text-muted-foreground">Archived</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{counts.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as SubmissionStatus | 'all')}>
        <TabsList className="mb-6">
          <TabsTrigger value="new" className="gap-2">
            <Clock className="w-4 h-4" />
            New
            {counts.new > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                {counts.new}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="reviewed" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Reviewed
          </TabsTrigger>
          <TabsTrigger value="archived" className="gap-2">
            <ArchiveIcon className="w-4 h-4" />
            Archived
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <Star className="w-4 h-4" />
            All
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl">
            {typeLabels[submissionType].icon}
            <h3 className="font-heading font-semibold text-lg text-foreground mb-2 mt-4">
              No {typeLabels[submissionType].label.toLowerCase()} found
            </h3>
            <p className="text-muted-foreground">
              {searchQuery.trim()
                ? `No results matching "${searchQuery}".`
                : statusFilter === 'new' 
                  ? `No new ${typeLabels[submissionType].label.toLowerCase()} submissions at this time.`
                  : `No ${statusFilter} ${typeLabels[submissionType].label.toLowerCase()} at this time.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissionType === 'estimates' && filteredSubmissions.map((submission) => (
              <EstimateSubmissionCard
                key={submission.id}
                submission={submission as EstimateSubmission}
                onUpdateStatus={updateStatus}
                onDelete={deleteSubmission}
              />
            ))}
            {submissionType === 'work_orders' && filteredSubmissions.map((submission) => (
              <WorkOrderSubmissionCard
                key={submission.id}
                submission={submission as WorkOrderSubmission}
                onUpdateStatus={updateStatus}
                onDelete={deleteSubmission}
                onEdit={updateWorkOrder}
              />
            ))}
            {submissionType === 'surveys' && filteredSubmissions.map((submission) => (
              <SurveySubmissionCard
                key={submission.id}
                submission={submission as SurveySubmission}
                onUpdateStatus={updateStatus}
                onDelete={deleteSubmission}
              />
            ))}
          </div>
        )}
      </Tabs>
    </div>
  );
};
