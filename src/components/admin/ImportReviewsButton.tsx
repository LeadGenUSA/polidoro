import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImportReviewsButtonProps {
  onImportComplete: () => void;
}

export function ImportReviewsButton({ onImportComplete }: ImportReviewsButtonProps) {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-google-reviews');

      if (error) throw error;

      if (data?.imported > 0) {
        toast({
          title: 'Reviews Imported',
          description: `Successfully imported ${data.imported} new review(s) from Google.`,
        });
        onImportComplete();
      } else if (data?.message) {
        toast({
          title: 'Import Complete',
          description: data.message,
        });
      } else {
        toast({
          title: 'No New Reviews',
          description: 'All Google reviews have already been imported.',
        });
      }
    } catch (error) {
      console.error('Error importing reviews:', error);

      let description =
        'Failed to import reviews from Google. Please check your API key configuration.';
      if (error instanceof FunctionsHttpError) {
        try {
          const body = await error.context.json();
          if (body?.message) description = body.message;
          else if (body?.error) description = body.error;
        } catch {
          /* keep the default message */
        }
      }

      toast({
        title: 'Import Failed',
        description,
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Button 
      onClick={handleImport}
      disabled={isImporting}
      variant="outline"
      className="gap-2"
    >
      {isImporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Importing...
        </>
      ) : (
        <>
          <RefreshCw className="w-4 h-4" />
          Import from Google
        </>
      )}
    </Button>
  );
}
