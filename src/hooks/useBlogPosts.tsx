import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
  content: string;
  featured_image_url: string | null;
  status: 'draft' | 'published' | 'rejected';
  faqs: { question: string; answer: string }[] | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useBlogPosts(filter?: 'draft' | 'published' | 'rejected' | 'all') {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (filter && filter !== 'all') {
        query = query.eq('status', filter);
      }
      const { data, error } = await query;
      if (error) throw error;
      setPosts((data as unknown as BlogPost[]) || []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      const updateData: Record<string, unknown> = { ...updates };
      if (updates.status === 'published' && !updates.published_at) {
        updateData.published_at = new Date().toISOString();
      }
      const { error } = await supabase.from('blog_posts').update(updateData).eq('id', id);
      if (error) throw error;
      toast({ title: 'Post updated successfully' });
      await fetchPosts();
    } catch (err) {
      toast({ title: 'Error updating post', variant: 'destructive' });
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Post deleted' });
      await fetchPosts();
    } catch (err) {
      toast({ title: 'Error deleting post', variant: 'destructive' });
    }
  };

  return { posts, isLoading, fetchPosts, updatePost, deletePost };
}

export function usePublishedBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublished = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (!error) setPosts((data as unknown as BlogPost[]) || []);
      setIsLoading(false);
    };
    fetchPublished();
  }, []);

  return { posts, isLoading };
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (!error && data) setPost(data as unknown as BlogPost);
      setIsLoading(false);
    };
    fetchPost();
  }, [slug]);

  return { post, isLoading };
}
