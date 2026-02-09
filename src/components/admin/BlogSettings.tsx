import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBlogSettings } from '@/hooks/useBlogSettings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Settings, Sparkles, Calendar } from 'lucide-react';

export const BlogSettings = ({ onPostGenerated }: { onPostGenerated?: () => void }) => {
  const { settings, isLoading, updateSettings } = useBlogSettings();
  const [nextTopic, setNextTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleFrequencyChange = (value: string) => {
    updateSettings({ generation_frequency: value as 'weekly' | 'biweekly' | 'monthly' | 'quarterly' });
  };

  const handleSaveTopic = () => {
    if (!nextTopic.trim()) return;
    updateSettings({ next_topic: nextTopic.trim() });
    setNextTopic('');
  };

  const handleClearTopic = () => {
    updateSettings({ next_topic: null });
  };

  const handleGenerateNow = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blog-post');
      if (error) throw error;
      toast({ title: 'Blog post generated!', description: 'A new draft post is ready for review.' });
      onPostGenerated?.();
    } catch (err) {
      toast({ title: 'Generation failed', description: err instanceof Error ? err.message : 'Unknown error', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="bg-card rounded-xl p-6 shadow-card mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-foreground">Blog Settings</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Frequency */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            <Calendar className="w-4 h-4 inline mr-1" />
            Generation Frequency
          </label>
          <Select
            value={settings?.generation_frequency || 'monthly'}
            onValueChange={handleFrequencyChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          {settings?.last_generated_at && (
            <p className="text-xs text-muted-foreground mt-1">
              Last generated: {new Date(settings.last_generated_at).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Next Topic */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Next Topic (optional)</label>
          {settings?.next_topic ? (
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground flex-1 truncate">{settings.next_topic}</p>
              <Button variant="ghost" size="sm" onClick={handleClearTopic}>Clear</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="e.g. sump pump maintenance for spring"
                value={nextTopic}
                onChange={(e) => setNextTopic(e.target.value)}
              />
              <Button size="sm" onClick={handleSaveTopic} disabled={!nextTopic.trim()}>Save</Button>
            </div>
          )}
        </div>

        {/* Generate Now */}
        <div className="flex items-end">
          <Button onClick={handleGenerateNow} disabled={isGenerating} className="gap-2 w-full">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? 'Generating...' : 'Generate Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};
