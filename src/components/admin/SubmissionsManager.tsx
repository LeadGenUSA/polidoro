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
  Calendar,
  Upload,
  FileInput,
  Mail,
  HelpCircle
} from 'lucide-react';
import { WorkOrderImportDialog } from './WorkOrderImportDialog';
import { EmailResultsDialog, extractRecipients } from './EmailResultsDialog';

export const SubmissionsManager = () => {
  const [submissionType, setSubmissionType] = useState<SubmissionType>('estimates');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  const { 
    submissions, 
    isLoading, 
    counts, 
    fetchSubmissions,
    updateStatus, 
    updateWorkOrder,
    deleteSubmission, 
    exportToCSV,
    exportToICS
  } = useSubmissions(submissionType, statusFilter);

  const EXCLUDED_SEARCH_KEYS = [
    'id',
    'photos',
    'created_at',
    'updated_at',
    'status',
    'user_id',
    'submission_id',
    'reviewed_by',
  ];

  const isExcludedKey = (key: string) =>
    EXCLUDED_SEARCH_KEYS.includes(key) || key.endsWith('_id') || key.endsWith('_at');

  const valueMatches = (value: unknown, q: string): boolean => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.some((v) => valueMatches(v, q));
    if (typeof value === 'object') {
      return Object.values(value as Record<string, unknown>).some((v) => valueMatches(v, q));
    }
    return String(value).toLowerCase().includes(q);
  };

  const normalizeName = (name: string) => name.toLowerCase().replace(/[\s_\-./#]+/g, '');

  /** Flattens a record into [fieldName, value] pairs, including extra_fields headings. */
  const fieldPairs = (record: Record<string, unknown>): [string, unknown][] => {
    const pairs: [string, unknown][] = [];
    Object.entries(record).forEach(([key, value]) => {
      if (isExcludedKey(key)) return;
      if (key === 'extra_fields' && value && typeof value === 'object' && !Array.isArray(value)) {
        Object.entries(value as Record<string, unknown>).forEach(([k, v]) => pairs.push([k, v]));
        return;
      }
      pairs.push([key, value]);
    });
    return pairs;
  };

  const keyValueMatches = (record: Record<string, unknown>, key: string, value: string) => {
    const nKey = normalizeName(key);
    if (!nKey) return false;
    return fieldPairs(record).some(([name, v]) => {
      const nName = normalizeName(name);
      if (!(nName === nKey || nName.includes(nKey))) return false;
      if (!value) return true;
      return valueMatches(v, value);
    });
  };

  const searchTerms = useMemo(
    () =>
      searchQuery
        .split(/\s+and\s+|&&|\n/i)
        .map((t) => t.trim())
        .filter(Boolean),
    [searchQuery]
  );

  const filteredSubmissions = useMemo(() => {
    if (searchTerms.length === 0) return submissions;
    return submissions.filter((s) => {
      const record = s as unknown as Record<string, unknown>;
      return searchTerms.every((term) => {
        const freeText = (t: string) => {
          const q = t.toLowerCase();
          return Object.entries(record).some(
            ([key, value]) => !isExcludedKey(key) && valueMatches(value, q)
          );
        };
        const colon = term.indexOf(':');
        if (colon > 0) {
          const key = term.slice(0, colon).trim();
          const value = term.slice(colon + 1).trim().toLowerCase();
          // Only treat as key:value when the record actually has such a field;
          // otherwise fall back to plain text search (times, "Re:", URLs...).
          if (key && fieldPairs(record).some(([name]) => {
            const n = normalizeName(name);
            const k = normalizeName(key);
            return !!k && (n === k || n.includes(k));
          })) {
            return keyValueMatches(record, key, value);
          }
        }
        return freeText(term);
      });
    });
  }, [submissions, searchTerms, submissionType]);

  const emailRecipientCount = useMemo(
    () =>
      extractRecipients(filteredSubmissions as unknown as Record<string, unknown>[]).recipients
        .length,
    [filteredSubmissions]
  );


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
            <>
              <Button onClick={() => setImportOpen(true)} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Import CSV
              </Button>
              <Button onClick={exportToICS} variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Export to Outlook
              </Button>
            </>
          )}
          <Button onClick={() => exportToCSV(filteredSubmissions)} variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => setEmailOpen(true)}
            variant="outline"
            className="gap-2"
            disabled={emailRecipientCount === 0}
          >
            <Mail className="w-4 h-4" />
            Email Results{emailRecipientCount > 0 ? ` (${emailRecipientCount})` : ''}
          </Button>
        </div>
      </div>

      <EmailResultsDialog
        open={emailOpen}
        onOpenChange={setEmailOpen}
        records={filteredSubmissions as unknown as Record<string, unknown>[]}
      />

      {/* Search */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${typeLabels[submissionType].label.toLowerCase()}... e.g. Boiler Type: NCB240 and Date Installed: 6/24/2021`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {searchTerms.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {filteredSubmissions.length} matching {filteredSubmissions.length === 1 ? 'record' : 'records'}
            {searchTerms.length > 1 ? ` for ${searchTerms.length} conditions` : ''} — Export CSV exports these results.
          </p>
        )}

        <details className="rounded-lg border bg-muted/40 p-3 text-sm">
          <summary className="cursor-pointer font-medium flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            How to search and email results
          </summary>
          <ol className="mt-3 space-y-2 list-decimal pl-5 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Search anything.</span> You never have to type a
              column name. Type any word or number and every field is searched at once, including columns
              from imported files. Example: <code>NCB240</code>
            </li>
            <li>
              <span className="font-medium text-foreground">Narrow to one field (optional).</span> Use a
              column name, a colon, then the value, when you only want matches in that field. Example:{' '}
              <code>Boiler Type: NCB240</code>
            </li>
            <li>
              <span className="font-medium text-foreground">Combine conditions.</span> Join them with{' '}
              <code>and</code>. Only records matching all conditions are shown. Example:{' '}
              <code>Boiler Type: NCB240 and Date Installed: 6/24/2021</code>
            </li>
            <li>
              <span className="font-medium text-foreground">Export CSV.</span> Downloads exactly the records
              currently listed, with every imported column as its own column.
            </li>
            <li>
              <span className="font-medium text-foreground">Email Results.</span> Sends your message to every
              customer in the current list who has an email address. Write a subject and message, optionally
              using <code>{'{{customer_name}}'}</code> and <code>{'{{address}}'}</code> to personalize each
              copy. You can attach a PDF — each page also appears as a picture inside the email. A
              confirmation shows the recipient count before anything sends, and each person receives their
              own copy, so nobody sees the other addresses.
            </li>
          </ol>
        </details>
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
          {submissionType === 'work_orders' && (
            <TabsTrigger value="imported" className="gap-2">
              <FileInput className="w-4 h-4" />
              Imported
              {counts.imported > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {counts.imported}
                </span>
              )}
            </TabsTrigger>
          )}
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

      <WorkOrderImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={() => {
          setStatusFilter('imported');
          fetchSubmissions();
        }}
      />
    </div>
  );
};
