import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Review {
  id: string;
  google_review_id: string | null;
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  text: string;
  title: string | null;
  location: string | null;
  review_date: string | null;
  source: 'google' | 'manual' | 'imported';
  status: 'pending' | 'approved' | 'rejected';
  category: string | null;
  approved_by: string | null;
  approved_at: string | null;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
}

export function useReviews(statusFilter?: 'pending' | 'approved' | 'rejected' | 'all') {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('reviews').select('*');
      
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setReviews((data as Review[]) || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
        })
        .eq('id', reviewId);
      
      if (error) throw error;
      
      toast({
        title: 'Review Approved',
        description: 'The review is now visible on the testimonials page.',
      });
      
      await fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve review',
        variant: 'destructive',
      });
    }
  };

  const rejectReview = async (reviewId: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          status: 'rejected',
          rejected_reason: reason || null,
        })
        .eq('id', reviewId);
      
      if (error) throw error;
      
      toast({
        title: 'Review Rejected',
        description: 'The review has been rejected.',
      });
      
      await fetchReviews();
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject review',
        variant: 'destructive',
      });
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) throw error;
      
      toast({
        title: 'Review Deleted',
        description: 'The review has been permanently deleted.',
      });
      
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  return {
    reviews,
    isLoading,
    fetchReviews,
    approveReview,
    rejectReview,
    deleteReview,
  };
}

export function useApprovedReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('status', 'approved')
          .order('review_date', { ascending: false });
        
        if (error) throw error;
        setReviews((data as Review[]) || []);
      } catch (error) {
        console.error('Error fetching approved reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedReviews();
  }, []);

  return { reviews, isLoading };
}
