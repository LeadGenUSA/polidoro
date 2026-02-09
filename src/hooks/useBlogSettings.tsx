import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlogSettings {
  id: string;
  generation_frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  next_topic: string | null;
  last_generated_at: string | null;
  updated_at: string;
}

export function useBlogSettings() {
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('blog_settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (!error && data) setSettings(data as unknown as BlogSettings);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const updateSettings = async (updates: Partial<BlogSettings>) => {
    if (!settings) return;
    try {
      const { error } = await supabase
        .from('blog_settings')
        .update(updates)
        .eq('id', settings.id);
      if (error) throw error;
      toast({ title: 'Settings updated' });
      await fetchSettings();
    } catch {
      toast({ title: 'Error updating settings', variant: 'destructive' });
    }
  };

  return { settings, isLoading, updateSettings, fetchSettings };
}
