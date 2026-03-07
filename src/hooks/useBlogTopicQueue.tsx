import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TopicQueueItem {
  id: string;
  topic: string;
  queue_order: number;
  status: 'pending' | 'used';
  created_at: string;
  used_at: string | null;
}

export function useBlogTopicQueue() {
  const [topics, setTopics] = useState<TopicQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTopics = useCallback(async () => {
    const { data, error } = await supabase
      .from('blog_topic_queue')
      .select('*')
      .eq('status', 'pending')
      .order('queue_order', { ascending: true });
    if (!error && data) setTopics(data as unknown as TopicQueueItem[]);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchTopics(); }, [fetchTopics]);

  const addTopics = async (newTopics: string[]) => {
    const maxOrder = topics.length > 0 ? Math.max(...topics.map(t => t.queue_order)) : 0;
    const rows = newTopics.map((topic, i) => ({
      topic: topic.trim(),
      queue_order: maxOrder + i + 1,
      status: 'pending' as const,
    }));

    const { error } = await supabase.from('blog_topic_queue').insert(rows);
    if (error) {
      toast({ title: 'Error adding topics', variant: 'destructive' });
      return;
    }
    toast({ title: `${rows.length} topic(s) added` });
    await fetchTopics();
  };

  const removeTopic = async (id: string) => {
    const { error } = await supabase.from('blog_topic_queue').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error removing topic', variant: 'destructive' });
      return;
    }
    await fetchTopics();
  };

  const moveUp = async (index: number) => {
    if (index <= 0) return;
    const updated = [...topics];
    const prevOrder = updated[index - 1].queue_order;
    const currOrder = updated[index].queue_order;

    await Promise.all([
      supabase.from('blog_topic_queue').update({ queue_order: currOrder }).eq('id', updated[index - 1].id),
      supabase.from('blog_topic_queue').update({ queue_order: prevOrder }).eq('id', updated[index].id),
    ]);
    await fetchTopics();
  };

  const moveDown = async (index: number) => {
    if (index >= topics.length - 1) return;
    const updated = [...topics];
    const nextOrder = updated[index + 1].queue_order;
    const currOrder = updated[index].queue_order;

    await Promise.all([
      supabase.from('blog_topic_queue').update({ queue_order: currOrder }).eq('id', updated[index + 1].id),
      supabase.from('blog_topic_queue').update({ queue_order: nextOrder }).eq('id', updated[index].id),
    ]);
    await fetchTopics();
  };

  return { topics, isLoading, addTopics, removeTopic, moveUp, moveDown, fetchTopics };
}
