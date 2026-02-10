import { useState, useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SmartTextareaProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const SmartTextarea = ({ value, onChange, id, placeholder, rows = 3, className }: SmartTextareaProps) => {
  const [isFixing, setIsFixing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const lastCheckedRef = useRef('');
  const { toast } = useToast();

  const callAI = useCallback(async (text: string, mode: 'fix' | 'improve') => {
    const { data, error } = await supabase.functions.invoke('check-spelling', {
      body: { text, mode },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data?.result || text;
  }, []);

  const handleBlur = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.split(/\s+/).length < 3 || trimmed === lastCheckedRef.current) return;
    
    setIsFixing(true);
    try {
      const result = await callAI(trimmed, 'fix');
      lastCheckedRef.current = result;
      if (result !== trimmed) {
        onChange(result);
        toast({ title: 'Spelling & grammar fixed', duration: 2000 });
      }
    } catch (e: any) {
      console.error('Auto-fix error:', e);
    } finally {
      setIsFixing(false);
    }
  }, [value, onChange, callAI, toast]);

  const handleImprove = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    
    setIsImproving(true);
    try {
      const result = await callAI(trimmed, 'improve');
      if (result !== trimmed) {
        setSuggestion(result);
      } else {
        toast({ title: 'Text already looks great!', duration: 2000 });
      }
    } catch (e: any) {
      console.error('Improve error:', e);
      toast({ title: 'Could not improve text', description: e.message, variant: 'destructive', duration: 3000 });
    } finally {
      setIsImproving(false);
    }
  }, [value, callAI, toast]);

  const acceptSuggestion = () => {
    if (suggestion) {
      onChange(suggestion);
      lastCheckedRef.current = suggestion;
    }
    setSuggestion(null);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={rows}
          className={`${className || ''} ${isFixing ? 'border-primary/50' : ''} pr-10`}
        />
        {isFixing && (
          <div className="absolute top-2 right-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          </div>
        )}
        {!isFixing && value.trim() && (
          <button
            type="button"
            onClick={handleImprove}
            disabled={isImproving}
            className="absolute top-2 right-2 p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
            title="Make It Better with AI"
          >
            {isImproving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {suggestion && (
        <div className="mt-2 p-3 rounded-md border border-primary/30 bg-primary/5 space-y-2">
          <p className="text-xs font-medium text-primary flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI Suggestion
          </p>
          <p className="text-sm text-foreground">{suggestion}</p>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="default" onClick={acceptSuggestion} className="h-7 text-xs">
              <Check className="w-3 h-3 mr-1" /> Accept
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setSuggestion(null)} className="h-7 text-xs">
              <X className="w-3 h-3 mr-1" /> Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartTextarea;
