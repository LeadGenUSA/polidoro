import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBlogSettings } from '@/hooks/useBlogSettings';
import { useBlogTopicQueue } from '@/hooks/useBlogTopicQueue';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Settings, Sparkles, Calendar, List, ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';

export const BlogSettings = ({ onPostGenerated }: { onPostGenerated?: () => void }) => {
  const { settings, isLoading: settingsLoading, updateSettings } = useBlogSettings();
  const { topics, isLoading: queueLoading, addTopics, removeTopic, moveUp, moveDown } = useBlogTopicQueue();
  const [bulkInput, setBulkInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleFrequencyChange = (value: string) => {
    updateSettings({ generation_frequency: value as 'weekly' | 'biweekly' | 'monthly' | 'quarterly' });
  };

  const handleBulkAdd = () => {
    const lines = bulkInput.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    addTopics(lines);
    setBulkInput('');
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

  if (settingsLoading || queueLoading) return null;

  return (
    <div className="bg-card rounded-xl p-6 shadow-card mb-8 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-foreground">Blog Settings</h3>
      </div>

      {/* Top row: Frequency + Generate Now */}
      <div className="grid md:grid-cols-2 gap-6">
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

        <div className="flex items-end">
          <Button onClick={handleGenerateNow} disabled={isGenerating} className="gap-2 w-full">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGenerating ? 'Generating...' : 'Generate Now'}
          </Button>
        </div>
      </div>

      {/* Topic Queue */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center gap-2 mb-4">
          <List className="w-5 h-5 text-primary" />
          <h4 className="font-heading font-bold text-foreground">Topic Queue</h4>
          <span className="text-sm text-muted-foreground ml-auto">
            {topics.length} topic{topics.length !== 1 ? 's' : ''} scheduled
          </span>
        </div>

        {/* Pending topics list */}
        {topics.length > 0 && (
          <div className="space-y-2 mb-4">
            {topics.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                <span className="text-xs font-mono text-muted-foreground w-6 shrink-0">{index + 1}.</span>
                <span className="text-sm text-foreground flex-1 truncate">{item.topic}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveUp(index)} disabled={index === 0}>
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveDown(index)} disabled={index === topics.length - 1}>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeTopic(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bulk add */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            <Plus className="w-4 h-4 inline mr-1" />
            Add Topics (one per line)
          </label>
          <Textarea
            placeholder={"How to prevent frozen pipes in Long Island homes\nSpring sump pump maintenance tips\nWhen to replace your water heater"}
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            rows={4}
          />
          <Button size="sm" className="mt-2 gap-2" onClick={handleBulkAdd} disabled={!bulkInput.trim()}>
            <Plus className="w-4 h-4" />
            Add to Queue
          </Button>
        </div>
      </div>
    </div>
  );
};
