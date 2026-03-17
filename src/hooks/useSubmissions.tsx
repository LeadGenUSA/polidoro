import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type SubmissionStatus = 'new' | 'reviewed' | 'archived';
export type SubmissionType = 'estimates' | 'work_orders' | 'surveys';

export interface EstimateSubmission {
  id: string;
  status: SubmissionStatus;
  created_at: string;
  customer: string;
  email: string;
  cost_of_job: string | null;
  boiler_types: string[] | null;
  boiler_size: string | null;
  baseboard: string | null;
  buried_tank_size: string[] | null;
  pump_and_foam: string | null;
  tank_sand: string | null;
  buried_price_additional: string | null;
  interior_tank_removed: string | null;
  interior_tank_behind_wall: string | null;
  interior_price_additional: string | null;
  exterior_275_removal: string | null;
  exterior_price_additional: string | null;
  customer_responsible_for_tank: string | null;
  tank_notes: string | null;
  steam_system: string | null;
  thermostats_included: string | null;
  existing_chimney_lined: string | null;
  chimney_lined_notes: string | null;
  vent_location: string | null;
  vent_location_notes: string | null;
  number_of_zones: string | null;
  zone_size: string | null;
  boiler_access: string | null;
  gas_needed_for: string[] | null;
  gas_in_house: string | null;
  gas_notes: string | null;
  meter_location: string | null;
  photos: string[] | null;
}

export interface WorkOrderSubmission {
  id: string;
  status: SubmissionStatus;
  created_at: string;
  customer_name: string;
  street_address: string;
  apt_number: string | null;
  phone: string;
  zip_code: string;
  email: string;
  email_to: string | null;
  error_code: string | null;
  make_model: string | null;
  serial_number: string | null;
  job_description: string;
  recommendations: string | null;
  rga_navien_tech: string | null;
  water_sampling_ph: string | null;
  parts_under_warranty: string | null;
  tech_on_job: string | null;
  hours_on_job: string | null;
  job_date: string | null;
  job_completed: string | null;
  payment_method: string | null;
  billing_status: string | null;
  total_charges: string | null;
  photos: string[] | null;
  calendar_info: string | null;
  boiler_type: string | null;
}

export interface SurveySubmission {
  id: string;
  status: SubmissionStatus;
  created_at: string;
  customer_name: string;
  email: string;
  phone: string | null;
  service_date: string | null;
  technician_name: string | null;
  overall_satisfaction: string | null;
  quality_of_work: string | null;
  timeliness: string | null;
  professionalism: string | null;
  communication: string | null;
  value_for_money: string | null;
  would_recommend: string | null;
  use_again: string | null;
  estimate_overpriced: string | null;
  satisfied_with_recommendation: string | null;
  were_we_professional: string | null;
  comfortable_with_tech: string | null;
  consider_installation: string | null;
  what_did_well: string | null;
  areas_to_improve: string | null;
  additional_comments: string | null;
}

export type Submission = EstimateSubmission | WorkOrderSubmission | SurveySubmission;

export const useSubmissions = (type: SubmissionType, statusFilter: SubmissionStatus | 'all' = 'all') => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({ new: 0, reviewed: 0, archived: 0, total: 0 });
  const { toast } = useToast();

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      let data: Submission[] = [];
      
      if (type === 'estimates') {
        let query = supabase
          .from('estimate_submissions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        
        const result = await query;
        if (result.error) throw result.error;
        data = (result.data || []) as unknown as EstimateSubmission[];
      } else if (type === 'work_orders') {
        let query = supabase
          .from('work_order_submissions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        
        const result = await query;
        if (result.error) throw result.error;
        data = (result.data || []) as unknown as WorkOrderSubmission[];
      } else if (type === 'surveys') {
        let query = supabase
          .from('survey_submissions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        
        const result = await query;
        if (result.error) throw result.error;
        data = (result.data || []) as unknown as SurveySubmission[];
      }

      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch submissions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [type, statusFilter, toast]);

  const fetchCounts = useCallback(async () => {
    try {
      let newCount = 0, reviewedCount = 0, archivedCount = 0;
      
      if (type === 'estimates') {
        const [n, r, a] = await Promise.all([
          supabase.from('estimate_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('estimate_submissions').select('id', { count: 'exact', head: true }).eq('status', 'reviewed'),
          supabase.from('estimate_submissions').select('id', { count: 'exact', head: true }).eq('status', 'archived'),
        ]);
        newCount = n.count || 0;
        reviewedCount = r.count || 0;
        archivedCount = a.count || 0;
      } else if (type === 'work_orders') {
        const [n, r, a] = await Promise.all([
          supabase.from('work_order_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('work_order_submissions').select('id', { count: 'exact', head: true }).eq('status', 'reviewed'),
          supabase.from('work_order_submissions').select('id', { count: 'exact', head: true }).eq('status', 'archived'),
        ]);
        newCount = n.count || 0;
        reviewedCount = r.count || 0;
        archivedCount = a.count || 0;
      } else if (type === 'surveys') {
        const [n, r, a] = await Promise.all([
          supabase.from('survey_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('survey_submissions').select('id', { count: 'exact', head: true }).eq('status', 'reviewed'),
          supabase.from('survey_submissions').select('id', { count: 'exact', head: true }).eq('status', 'archived'),
        ]);
        newCount = n.count || 0;
        reviewedCount = r.count || 0;
        archivedCount = a.count || 0;
      }

      setCounts({
        new: newCount,
        reviewed: reviewedCount,
        archived: archivedCount,
        total: newCount + reviewedCount + archivedCount,
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  }, [type]);

  useEffect(() => {
    fetchSubmissions();
    fetchCounts();
  }, [fetchSubmissions, fetchCounts]);

  const updateStatus = async (id: string, newStatus: SubmissionStatus) => {
    try {
      let error = null;
      
      if (type === 'estimates') {
        const result = await supabase.from('estimate_submissions').update({ status: newStatus }).eq('id', id);
        error = result.error;
      } else if (type === 'work_orders') {
        const result = await supabase.from('work_order_submissions').update({ status: newStatus }).eq('id', id);
        error = result.error;
      } else if (type === 'surveys') {
        const result = await supabase.from('survey_submissions').update({ status: newStatus }).eq('id', id);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Submission marked as ${newStatus}`,
      });

      fetchSubmissions();
      fetchCounts();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      let error = null;
      
      if (type === 'estimates') {
        const result = await supabase.from('estimate_submissions').delete().eq('id', id);
        error = result.error;
      } else if (type === 'work_orders') {
        const result = await supabase.from('work_order_submissions').delete().eq('id', id);
        error = result.error;
      } else if (type === 'surveys') {
        const result = await supabase.from('survey_submissions').delete().eq('id', id);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Submission deleted',
      });

      fetchSubmissions();
      fetchCounts();
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete submission',
        variant: 'destructive',
      });
    }
  };

  const exportToCSV = () => {
    if (submissions.length === 0) {
      toast({
        title: 'No data',
        description: 'No submissions to export',
        variant: 'destructive',
      });
      return;
    }

    const headers = Object.keys(submissions[0]);
    const csvRows = [
      headers.join(','),
      ...submissions.map((row) =>
        headers
          .map((header) => {
            const value = (row as unknown as Record<string, unknown>)[header];
            if (value === null || value === undefined) return '""';
            if (Array.isArray(value)) return `"${value.join('; ')}"`;
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: `Exported ${submissions.length} submissions to CSV`,
    });
  };

  return {
    submissions,
    isLoading,
    counts,
    fetchSubmissions,
    updateStatus,
    deleteSubmission,
    exportToCSV,
  };
};

// Hook to get counts for all submission types
export const useAllSubmissionCounts = () => {
  const [counts, setCounts] = useState({
    estimates: 0,
    work_orders: 0,
    surveys: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchAllCounts = async () => {
      try {
        const [estimates, workOrders, surveys] = await Promise.all([
          supabase.from('estimate_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('work_order_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('survey_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        ]);

        const estimateCount = estimates.count || 0;
        const workOrderCount = workOrders.count || 0;
        const surveyCount = surveys.count || 0;

        setCounts({
          estimates: estimateCount,
          work_orders: workOrderCount,
          surveys: surveyCount,
          total: estimateCount + workOrderCount + surveyCount,
        });
      } catch (error) {
        console.error('Error fetching all counts:', error);
      }
    };

    fetchAllCounts();
  }, []);

  return counts;
};
