import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface YouTubeVideo {
  id: string;
  youtube_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  view_count: string | null;
  published_at: string | null;
  is_active: boolean;
  category: string | null;
}

export function useYouTubeVideos() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('youtube_videos')
      .select('*')
      .order('published_at', { ascending: false });

    if (!error && data) {
      setVideos(data as YouTubeVideo[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return { videos, isLoading, refetch: fetchVideos };
}

export function useYouTubeVideosAdmin() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchVideos = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('youtube_videos')
      .select('*')
      .order('published_at', { ascending: false });

    if (!error && data) {
      setVideos(data as YouTubeVideo[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const syncVideos = async () => {
    setIsSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('fetch-youtube-videos', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      await fetchVideos();
      return data;
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('youtube_videos')
      .update({ is_active: isActive })
      .eq('id', id);
    if (!error) {
      setVideos(prev => prev.map(v => v.id === id ? { ...v, is_active: isActive } : v));
    }
    return { error };
  };

  const updateCategory = async (id: string, category: string | null) => {
    const { error } = await supabase
      .from('youtube_videos')
      .update({ category })
      .eq('id', id);
    if (!error) {
      setVideos(prev => prev.map(v => v.id === id ? { ...v, category } : v));
    }
    return { error };
  };

  return { videos, isLoading, isSyncing, syncVideos, toggleActive, updateCategory, refetch: fetchVideos };
}
